---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 
  text: "长  风  破  浪  会  有  时\n直  挂  云  帆  济  沧  海"
  tagline: 记录我所学的
  actions:
    - theme: alt
      text: Deep Learning
      link: /deeplearning/
  #   - theme: alt
  #     text: API Examples
  #     link: /api-examples
  image:
    src: /programmer.svg
    alt: The Transformer - model architecture

features:
  - icon: 🛸
    title: Deep Learning
    details: Neural Network、 CNN、 RNN、 Transformer
  - icon: ⚖️
    title: Architecture
    details: Maintainability, Modifiability, Testability, Traceability, Scalability, Reusability, Performance, Availability and Security
  - icon: 🦀
    title: Rust
    details: Performance、Reliability and Productivity
# - title: Others
  #   details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  /* --vp-home-hero-image-background-image: linear-gradient(-45deg, #00BFA6 50%, #00B0FF 50%); */
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>