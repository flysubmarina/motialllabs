<template>
  <div class="container"></div>
</template>

<script>


export default {
  data() {
    return {};
  },
  mounted() {
      let pixi = new PIXI.Application({
  width: 256,
  height: 256,
  antialias: true,
  transparent: true,
  resolution: 1
});
let el = document.body.getElementsByClassName("container")[0];
el.appendChild(pixi.view);

PIXI.loader.add("../assets/person.png").load(setup);
function setup() {
  let cat = new PIXI.Sprite(
    PIXI.loader.resources["../assets/person.png"].texture
  );

  pixi.stage.addChild(cat);
}
  },
  methods: {}
};
</script>

<style scoped>
.container {
  margin: 30px auto;
}
</style>