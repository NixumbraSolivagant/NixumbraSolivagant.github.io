<template>
  <section class="about-page">
    <NavBar />
    <div class="about-hero">
      <div class="about-avatar">
        <img src="/static/img/avatar.png" alt="Avatar" />
        <div class="avatar-ring"></div>
      </div>
      <div class="about-intro">
        <h1 class="about-name">{{ t('about.aboutName') }}</h1>
        <p class="about-subtitle">{{ t('about.aboutSubtitle') }}</p>
        <p class="about-location">
          <svg width="16" height="16" viewBox="0 0 1024 1024" fill="currentColor">
            <path d="M512 249.976471c-99.388235 0-180.705882 81.317647-180.705882 180.705882s81.317647 180.705882 180.705882 180.705882 180.705882-81.317647 180.705882-180.705882-81.317647-180.705882-180.705882-180.705882z m0 301.17647c-66.258824 0-120.470588-54.211765-120.470588-120.470588s54.211765-120.470588 120.470588-120.470588 120.470588 54.211765 120.470588 120.470588-54.211765 120.470588-120.470588 120.470588z"/>
            <path d="M512 39.152941c-216.847059 0-391.529412 174.682353-391.529412 391.529412 0 349.364706 391.529412 572.235294 391.529412 572.235294s391.529412-222.870588 391.529412-572.235294c0-216.847059-174.682353-391.529412-391.529412-391.529412z m0 891.482353C424.658824 873.411765 180.705882 686.682353 180.705882 430.682353c0-183.717647 147.576471-331.294118 331.294118-331.294118s331.294118 147.576471 331.294118 331.294118c0 256-243.952941 442.729412-331.294118 499.952941z"/>
          </svg>
          {{ t('about.aboutLocation') }}
        </p>
        <div class="about-links">
          <a href="https://github.com/NixumbraSolivagant" target="_blank" rel="noreferrer" class="about-link github">
            <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
              <path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z"/>
            </svg>
            {{ t('about.aboutGithub') }}
          </a>
          <a href="mailto:Hmzemc333@outlook.com" class="about-link mail">
            <svg viewBox="0 0 1024 1024" width="18" height="18" fill="currentColor">
              <path d="M926.47619 355.644952V780.190476a73.142857 73.142857 0 0 1-73.142857 73.142857H170.666667a73.142857 73.142857 0 0 1-73.142857-73.142857V355.644952l304.103619 257.828572a170.666667 170.666667 0 0 0 220.745142 0L926.47619 355.644952z"/>
            </svg>
            {{ t('about.aboutMail') }}
          </a>
        </div>
      </div>
    </div>

    <div class="about-body">
      <div class="about-section">
        <h2 class="section-title">
          <svg viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
            <path d="M629.333333 202.666667v213.333333h277.333334v448h-512v-213.333333h-277.333334v-448h512z m213.333334 277.333333h-213.333334v170.666667h-170.666666v149.333333h384v-320z"/>
          </svg>
          {{ t('about.sectionAbout') }}
        </h2>
        <div class="about-card">
          <p>{{ t('about.aboutDesc1') }}</p>
          <p>{{ t('about.aboutDesc2') }}</p>
        </div>
      </div>

      <div class="about-section">
        <h2 class="section-title">
          <svg viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
            <path d="M395.765333 586.570667h-171.733333c-22.421333 0-37.888-22.442667-29.909333-43.381334L364.768 95.274667A32 32 0 0 1 394.666667 74.666667h287.957333c22.72 0 38.208 23.018667 29.632 44.064l-99.36 243.882666h187.050667c27.509333 0 42.186667 32.426667 24.042666 53.098667l-458.602666 522.56c-22.293333 25.408-63.626667 3.392-54.976-29.28l85.354666-322.421333z"/>
          </svg>
          {{ t('about.sectionSkills') }}
        </h2>
        <div class="about-card">
          <div class="skills-grid">
            <div class="skill-category">
              <h3>{{ t('about.skillsFrontend') }}</h3>
              <div class="skill-tags">
                <span class="skill-tag">Vue.js</span>
                <span class="skill-tag">JavaScript</span>
                <span class="skill-tag">HTML/CSS</span>
                <span class="skill-tag">Three.js</span>
                <span class="skill-tag">D3.js</span>
              </div>
            </div>
            <div class="skill-category">
              <h3>{{ t('about.skillsBackend') }}</h3>
              <div class="skill-tags">
                <span class="skill-tag">Python</span>
                <span class="skill-tag">C/C++</span>
                <span class="skill-tag">Linux</span>
                <span class="skill-tag">Git</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2 class="section-title">
          <svg viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
            <path d="M512 249.976471c-99.388235 0-180.705882 81.317647-180.705882 180.705882s81.317647 180.705882 180.705882 180.705882 180.705882-81.317647 180.705882-180.705882-81.317647-180.705882-180.705882-180.705882z"/>
          </svg>
          {{ t('about.sectionHobbies') }}
        </h2>
        <div class="about-card">
          <div class="hobby-grid">
            <div class="hobby-item">
              <div class="hobby-icon">🚴</div>
              <h3>{{ t('about.hobbyCycling') }}</h3>
              <p>{{ t('about.hobbyCyclingDesc') }}</p>
            </div>
            <div class="hobby-item">
              <div class="hobby-icon">🧩</div>
              <h3>{{ t('about.hobbyCube') }}</h3>
              <p>{{ t('about.hobbyCubeDesc') }}</p>
            </div>
            <div class="hobby-item">
              <div class="hobby-icon">🥾</div>
              <h3>{{ t('about.hobbyHiking') }}</h3>
              <p>{{ t('about.hobbyHikingDesc') }}</p>
            </div>
            <div class="hobby-item">
              <div class="hobby-icon">🥋</div>
              <h3>{{ t('about.hobbyMartial') }}</h3>
              <p>{{ t('about.hobbyMartialDesc') }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="about-section">
        <h2 class="section-title">
          <svg viewBox="0 0 1024 1024" width="20" height="20" fill="currentColor">
            <path d="M938.666667 85.333333H85.333333a85.333333 85.333333 0 0 0-85.333333 85.333334v682.666666a85.333333 85.333333 0 0 0 85.333333 85.333334h853.333334a85.333333 85.333333 0 0 0 85.333333-85.333334V170.666667a85.333333 85.333333 0 0 0-85.333333-85.333334z m-85.333334 426.666667a34.133333 34.133333 0 1 1 0 68.266666 34.133333 34.133333 0 0 1 0-68.266666z m-682.666666 0a34.133333 34.133333 0 1 1 0 68.266666 34.133333 34.133333 0 0 1 0-68.266666z"/>
          </svg>
          {{ t('about.sectionContact') }}
        </h2>
        <div class="about-card contact-card">
          <div class="contact-item">
            <span class="contact-label">{{ t('about.contactEmail') }}</span>
            <a href="mailto:Hmzemc333@outlook.com" class="contact-value">Hmzemc333@outlook.com</a>
          </div>
          <div class="contact-item">
            <span class="contact-label">{{ t('about.contactGithub') }}</span>
            <a href="https://github.com/NixumbraSolivagant" target="_blank" rel="noreferrer" class="contact-value">@NixumbraSolivagant</a>
          </div>
          <p class="contact-note">{{ t('about.contactNote') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import NavBar from '@/components/NavBar.vue'

const { t } = useI18n()
</script>

<style scoped>
.about-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 70px 16px 60px;
}

.about-hero {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 40px 0 32px;
  border-bottom: 1px solid var(--card_stroke_color);
  margin-bottom: 32px;
}

.about-avatar {
  position: relative;
  flex-shrink: 0;
  width: 100px;
  height: 100px;
}

.about-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  background-position: center -10%;
  position: relative;
  z-index: 1;
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #bd34fe, #e0321b, #41d1ff);
  z-index: 0;
}

.about-intro {
  flex: 1;
}

.about-name {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--main_text_color);
}

.about-subtitle {
  font-size: 1rem;
  color: var(--item_left_text_color);
  margin-bottom: 8px;
}

.about-location {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--item_left_text_color);
  font-size: 0.9rem;
  margin-bottom: 16px;
  opacity: 0.75;
}

.about-links {
  display: flex;
  gap: 12px;
}

.about-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.about-link:hover {
  transform: translateY(-2px);
}

.github {
  background: var(--item_bg_color);
  color: var(--main_text_color);
  border: 1px solid var(--card_stroke_color);
}

.mail {
  background: var(--item_bg_color);
  color: var(--main_text_color);
  border: 1px solid var(--card_stroke_color);
  opacity: 0.85;
}

.about-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.about-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--main_text_color);
}

.section-title svg {
  color: var(--accent);
}

.about-card {
  background: var(--item_bg_color);
  border: 1px solid var(--card_stroke_color);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-card p {
  color: var(--item_left_text_color);
  line-height: 1.8;
  font-size: 0.95rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.skill-category h3 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--main_text_color);
  margin-bottom: 10px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  background: var(--item_hover_color);
  color: var(--main_text_color);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
}

.hobby-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
}

.hobby-item {
  background: var(--item_hover_color);
  border-radius: 14px;
  padding: 18px 14px;
  text-align: center;
  border: 1px solid var(--card_stroke_color);
}

.hobby-icon {
  font-size: 1.8rem;
  margin-bottom: 8px;
}

.hobby-item h3 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--main_text_color);
  margin-bottom: 4px;
}

.hobby-item p {
  font-size: 0.8rem;
  color: var(--item_left_text_color);
}

.contact-card {
  gap: 14px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.contact-label {
  font-weight: 700;
  color: var(--item_left_text_color);
  font-size: 0.85rem;
  min-width: 48px;
  opacity: 0.7;
}

.contact-value {
  color: var(--accent_strong);
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
}

.contact-value:hover {
  text-decoration: underline;
}

.contact-note {
  color: var(--item_left_text_color);
  font-size: 0.85rem;
  border-top: 1px solid var(--card_stroke_color);
  padding-top: 12px;
  margin-top: 4px;
  opacity: 0.75;
}

@media (max-width: 640px) {
  .about-hero {
    flex-direction: column;
    text-align: center;
    padding-top: 24px;
  }

  .about-links {
    justify-content: center;
  }

  .skills-grid,
  .hobby-grid {
    grid-template-columns: 1fr;
  }
}
</style>
