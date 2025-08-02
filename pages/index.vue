<template>
  <div>
    <v-parallax
      :src="img"
      height="100vh"
      lazy-src="/images/reflection_small.webp"
      alt="A serene landscape with mountains reflected in still water, with clouds above"
      aria-label="Hero section background"
    >
      <div class="d-flex flex-column fill-height justify-center">
        <v-sheet
          class="transparent-card pa-4"
          flat
          theme="dark"
        >
          <v-card-title>
            <h1>
              <span class="personal-heading text-h2 mb-4 d-block">Hello there!</span>
              <span class="personal-heading text-h3 mb-4 text-wrap d-block">Welcome to my
                website</span>
            </h1>
          </v-card-title>
          <v-card-text>
            <v-btn
              to="/games"
              class="text-h6 personal-text"
              variant="flat"
              prepend-icon="$gamepad-variant"
            >Explore my games!</v-btn>
          </v-card-text>
        </v-sheet>
      </div>
    </v-parallax>
    <v-container class="mb-10">
      <h2 class="personal-heading text-h3 my-8">My name is Jason Suttles.</h2>
      <nav
        class="d-flex flex-wrap justify-center my-8"
        aria-label="Main navigation"
      >
        <v-btn
          href="https://www.linkedin.com/in/jssuttles/"
          target="_blank"
          variant="flat"
          class="personal-text ma-2"
          min-width="140"
          prepend-icon="$linkedin"
          aria-label="LinkedIn profile (opens in new window)"
        >
          LinkedIn
        </v-btn>
        <v-btn
          href="https://github.com/Djeisen642"
          target="_blank"
          variant="flat"
          class="personal-text ma-2"
          min-width="140"
          prepend-icon="$github"
          aria-label="GitHub profile (opens in new window)"
        >
          GitHub
        </v-btn>
        <v-btn
          to="/links"
          variant="flat"
          class="personal-text ma-2"
          min-width="140"
          prepend-icon="$link-variant"
        >
          Interesting Links
        </v-btn>
        <v-btn
          to="/games"
          variant="flat"
          class="personal-text ma-2"
          min-width="140"
          prepend-icon="$gamepad-variant"
        >
          Games
        </v-btn>
        <v-btn
          to="/blog"
          variant="flat"
          class="personal-text ma-2"
          min-width="140"
          prepend-icon="$post"
        >
          Blog
        </v-btn>
      </nav>
      <article class="mt-12 pos-relative">
        <div class="personal-text">
          <p class="mb-6">
            Hey there! I'm Jason, and I'm currently crafting healthcare solutions at Medicom
            Technologies. My work involves building software that handles medical image transfers
            and creates automated solutions. I get to work across the full stack, doing some pretty
            cool stuff with websockets, AWS infrastructure, microservices, CDK, and CI/CD pipelines.
            You
            name it in modern web development, I've probably tinkered with it!
          </p>
          <p class="mb-6">
            I'm primarily a JavaScript/TypeScript developer, with a pretty solid grasp of what's
            possible in the JavaScript ecosystem. And about this website's design... *nervous laugh*
            While I might not be winning any design awards, here's my superpower:
            <em class="font-weight-bold">If you can design it, I can very likely build it.</em>
          </p>
          <p class="mb-6">
            When I'm not coding, you'll find me exploring new trails, trying out different cuisines,
            playing sports (casually), gaming (also casually), and absolutely dominating at board
            games (not so casually). My dream scenario? Working on innovative, meaningful software
            projects with brilliant, fun people, while having plenty of time for family, friends,
            and adventures. I thrive on being both useful and competent.
          </p>
          <p class="mb-6">
            Fun fact: I've got an interesting mix of degrees - Computer Science and Philosophy,
            plus a minor in Mathematics.
          </p>
          <p class="mb-6">
            That's my story in a nutshell! Feel free to explore the site - there's plenty to
            discover here. And maybe bookmark it? I'm always adding new surprises that you might
            find helpful. Who knows what'll pop up next?
          </p>
        </div>
      </article>
    </v-container>
  </div>
</template>

<script setup lang="ts">
const img = ref('/images/reflection.webp');
const device = useDevice();
if (device.isMobile) {
  img.value = '/images/reflection-mobile.webp';
}
definePageMeta({
  layout: 'homepage',
});
useHead({
  title: 'Home',
});
</script>
<style lang="scss" scoped>
.personal-heading {
  font-family: 'Permanent Marker', Roboto, sans-serif;
  margin-bottom: 1.5rem;
}

.personal-text {
  font-family: 'Patrick Hand', Roboto, sans-serif;
  font-size: 1.25rem;
  line-height: 1.7;
  letter-spacing: 0.02em;
}

.transparent-card {
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgb(0, 0, 0, 10%);
  background: rgb(0, 0, 0, 30%);
}

@media (prefers-color-scheme: dark) {
  .personal-text {
    color: rgb(255, 255, 255, 87%);
  }
}
</style>
