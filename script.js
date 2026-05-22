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

const setHref = (id, href) => {
  const el = document.getElementById(id);
  if (el) el.href = href;
};

setText('hero-name', content.hero.name);
setText('hero-tagline', content.hero.tagline);
setText('hero-subcopy', content.hero.subcopy);
setText('primary-cta-label', content.hero.primaryCta);
setText('secondary-cta-label', content.hero.secondaryCta);
setText('trust-1', content.trust[0]);
setText('trust-2', content.trust[1]);
setText('trust-3', content.trust[2]);
setText('about-heading', content.about.heading);
setText('about-copy-1', content.about.copy1);
setText('about-copy-2', content.about.copy2);
setText('languages-note', content.languages);
setText('footer-name', content.footer.name);
setText('footer-brokerage', content.footer.brokerage);

setLink('contact-phone', content.contact.phoneLabel, content.contact.phoneHref);
setLink('contact-email', content.contact.emailLabel, content.contact.emailHref);
setLink('contact-text', content.contact.textLabel, content.contact.textHref);

setHref('primary-cta', content.contact.textHref);
setHref('secondary-cta', content.contact.emailHref);
setHref('footer-instagram', content.socials.instagram);
setHref('footer-facebook', content.socials.facebook);
setHref('footer-x', content.socials.x);

const reviewsTrack = document.getElementById('reviews-track');
const reviewModal = document.getElementById('review-modal');
const reviewModalText = document.getElementById('review-modal-text');
const reviewModalAuthor = document.getElementById('review-modal-author');
const reviewModalMeta = document.getElementById('review-modal-meta');
const reviewModalClose = document.getElementById('review-modal-close');
const reviewsScroller = document.getElementById('reviews-scroller');

const openReviewModal = (review) => {
  reviewModalText.textContent = review.quote;
  reviewModalAuthor.textContent = review.author;
  reviewModalMeta.textContent = review.meta;
  reviewModal.classList.add('open');
  reviewModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
};

const closeReviewModal = () => {
  reviewModal.classList.remove('open');
  reviewModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

content.reviews.forEach((review) => {
  const card = document.createElement('article');
  const isHighlight = review.meta.toLowerCase().includes('client highlight');
  card.className = `review-card tilt-card${isHighlight ? ' review-card-highlight' : ''}`;
  const isLong = review.quote.length > 135;
  card.innerHTML = `
    <div class="stars">★★★★★</div>
    <p class="review-quote${isLong ? ' is-truncated' : ''}">${review.quote}</p>
    ${isLong ? '<button class="review-read-more" type="button">Read more</button>' : ''}
    <footer>
      <strong>${review.author}</strong>
      <span>${review.meta}</span>
    </footer>
  `;
  if (isLong) {
    card.querySelector('.review-read-more')?.addEventListener('click', () => openReviewModal(review));
  }
  reviewsTrack.appendChild(card);
});

reviewModalClose?.addEventListener('click', closeReviewModal);
reviewModal?.addEventListener('click', (event) => {
  if (event.target instanceof HTMLElement && event.target.dataset.closeReview === 'true') {
    closeReviewModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && reviewModal?.classList.contains('open')) {
    closeReviewModal();
  }
});

if (reviewsScroller) {
  let isPointerDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  reviewsScroller.addEventListener('pointerdown', (event) => {
    isPointerDown = true;
    startX = event.clientX;
    startScrollLeft = reviewsScroller.scrollLeft;
    reviewsScroller.classList.add('is-dragging');
  });

  reviewsScroller.addEventListener('pointermove', (event) => {
    if (!isPointerDown) return;
    const walk = event.clientX - startX;
    reviewsScroller.scrollLeft = startScrollLeft - walk;
  });

  const stopDragging = () => {
    isPointerDown = false;
    reviewsScroller.classList.remove('is-dragging');
  };

  reviewsScroller.addEventListener('pointerup', stopDragging);
  reviewsScroller.addEventListener('pointerleave', stopDragging);
  reviewsScroller.addEventListener('pointercancel', stopDragging);
}

const servicesGrid = document.getElementById('services-grid');
content.services.forEach((service) => {
  const card = document.createElement('article');
  card.className = 'service-card reveal tilt-card';
  card.innerHTML = `
    <span class="service-icon">${service.icon || '•'}</span>
    <h3>${service.title}</h3>
    <p>${service.body}</p>
  `;
  servicesGrid.appendChild(card);
});

const processGrid = document.getElementById('process-grid');
content.processes?.cards?.forEach((process) => {
  const card = document.createElement('article');
  card.className = 'process-card reveal tilt-card';
  card.innerHTML = `
    <h3>${process.label}</h3>
    <p>${process.body}</p>
    <a class="process-link" href="./process.html?type=${process.slug}">Open roadmap</a>
  `;
  processGrid?.appendChild(card);
});

const placesRoad = document.getElementById('places-road');
content.placesWorked?.forEach((place, index) => {
  const item = document.createElement('div');
  item.className = 'place-stop';
  item.innerHTML = `
    <span class="place-pin">${index + 1}</span>
    <strong>${place}</strong>
  `;
  placesRoad?.appendChild(item);
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
