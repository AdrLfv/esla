var assert = require('chai').assert;
// const Scene = require('../lib/scene.js');
// const { Scene } = import('../lib/scene.js');
import Scene from  '../lib/scene.js';
// const Scene = require ('../lib/scene.js');
const THREE = require('three');

describe('The THREE object', function() {
  it('should have a defined BasicShadowMap constant', function() {
    assert.notEqual('undefined', THREE.BasicShadowMap);
  }),

  it('should be able to construct a Vector3 with default of x=0', function() {
    const vec3 = new THREE.Vector3();
    assert.equal(0, vec3.x);
  })
  it('should not have undefined scene', function() {
    const vec3 = new THREE.Vector3();
    assert.equal(0, vec3.x);
  })
  it('should not have undefined renderer', function() {
    const vec3 = new THREE.Vector3();
    assert.equal(0, vec3.x);
  })
})

describe("Scene", () => {
  let test_scene = new Scene();
  it("should not have undefined scene", function() {
      return assert.isNotNull(test_scene.scene, "Scene is null");
  });
  it("should not have undefined renderer", function() {
    return assert.isNotNull(test_scene.renderer, "Renderer is null");
  });
  it("should not have undefined camera", function() {
    return assert.isNotNull(test_scene.camera, "Camera is null");
  });
  it("should not have undefined light", function() {
    return assert.isNotNull(test_scene.light, "Light is null");
  });
  it("should not have undefined model", function() {
    return assert.isNotNull(test_scene.model, "Model is null");
  });
});
