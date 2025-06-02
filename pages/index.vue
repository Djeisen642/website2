<template>
  <div>
    <v-parallax
      :src="img"
      height="100vh"
      lazy-src="/images/reflection_small.webp"
      alt="Background image of clouds, mountains, and reflection"
    >
      <div class="d-flex flex-column fill-height justify-center">
        <v-sheet
          color="transparent-card pa-4"
          flat
          theme="dark"
        >
          <v-card-title>
            <p class="text-h2 mb-4">Hello there!</p>
            <p class="text-h3 mb-4 text-wrap">Welcome to my website</p>
          </v-card-title>
          <v-card-text>
            <v-btn to="/games">Check out my games!</v-btn>
          </v-card-text>
        </v-sheet>
      </div>
    </v-parallax>
    <v-container class="mb-10">
      <h1 class="text-h3 my-8">My name is Jason Suttles.</h1>
      <!--      <p class="text-h5 mb-4">Umm... Here's my resumé.</p>-->
      <p class="text-h5 mb-4">
        <a
          href="https://www.linkedin.com/in/jssuttles/"
          target="_blank"
        >
          Umm... Here's my LinkedIn
        </a>
      </p>
      <p class="text-h5 mb-4">
        <a
          href="https://github.com/Djeisen642"
          target="_blank"
        >My Github account...</a>
      </p>
      <!--      <p class="text-h5 mb-4">The projects I've been working on...</p>-->
      <p class="text-h5 mb-4">
        <a
          href="/links"
          target="_blank"
        >Some things I find interesting...</a>
      </p>
      <p class="text-h5 mb-4"><a
          href="/games"
          target="_blank"
        >I mentioned games, right?</a>
      </p>
      <p class="text-h5 mb-4"><a
          href="/blog"
          target="_blank"
        >I have a blog now!</a>
      </p>
      <p class="text-body mb-4">
        Oh... Introductions? Umm... Hi! My name is Jason Suttles. I currently work at Medicom
        Technologies building healthcare software transferring medical images and facilitating
        automated solutions. I work on frontend work and backend work. We do some cool things with
        websockets and AWS cloud infrastructure. Microservices. CDK. CI/CD pipelines. (I've touched
        it all.) Mostly, I'm a JavaScript/TypeScript developer. I'd say I've got a very good handle
        on what is possible in the JavaScript world. &lt;Awkward silence&gt; What's that? You don't
        like how this website looks? Hmm... well, I can't say that I've got a good eye for how to
        make things look nice.
        <em>But, if you can design it, I can build it.</em> Take a look at the games. I didn't
        design them, but I definitely developed them.
      </p>
      <p class="text-body mb-4">
        In my free time, I enjoy travelling, hiking, doing new things, eating new foods, playing
        sports casually, playing video games casually, and playing board games viciously. If I had
        an infinite budget, I'd spend my time working on modern, interesting, and worthwhile
        software projects with knowledgeable and fun people, peppering my time with family, friends,
        and travel. I like being useful and competent.
      </p>
      <p class="text-body mb-4">
        Did I mention I have a philosophy degree along with my comp. sci. degree and math minor?
      </p>
      <p class="text-body">
        Well... that's enough about me. Feel free to browse around and/or get back to whatever you
        were doing before. I do recommend coming back every once in a while, though. This website
        might surprise you with something useful.
      </p>
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
.bg-transparent-card {
  background-color: rgb(var(--v-theme-primary-lighten-3), 0.4);
}
</style>
