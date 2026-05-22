const content = window.siteContent;

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
};

const setLink = (id, label, href) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = label;
  el.href = href;
};

const params = new URLSearchParams(window.location.search);
const requestedType = params.get('type') || 'buying';
const processData = content.processes?.detail?.[requestedType] || content.processes?.detail?.buying;

setText('roadmap-heading', processData.eyebrow);
document.title = `Leo | ${processData.eyebrow}`;

setLink('contact-phone', content.contact.phoneLabel, content.contact.phoneHref);
setLink('contact-email', content.contact.emailLabel, content.contact.emailHref);
setLink('contact-text', content.contact.textLabel, content.contact.textHref);

const tabGroup = document.getElementById('process-tab-group');
content.processes?.cards?.forEach((process) => {
  const link = document.createElement('a');
  link.className = `process-tab${process.slug === requestedType ? ' active' : ''}`;
  link.href = `./process.html?type=${process.slug}`;
  link.textContent = process.label;
  tabGroup?.appendChild(link);
});

const roadmapGrid = document.getElementById('roadmap-grid');
processData.steps.forEach((step, index) => {
  const card = document.createElement('article');
  card.className = 'roadmap-step reveal';
  card.innerHTML = `
    <div class="roadmap-rail">
      <span class="roadmap-step-number">${index + 1}</span>
    </div>
    <div class="roadmap-step-copy">
      <h3>${step.title}</h3>
      <p>${step.body}</p>
    </div>
  `;
  roadmapGrid?.appendChild(card);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelectorAll('.tilt-card').forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -6;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
