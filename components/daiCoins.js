import * as THREE from 'three';
import * as CANNON from 'cannon';
import React, { useMemo } from 'react';
import { Canvas } from 'react-three-fiber';
import { useCannon, Provider } from '../hooks/useCannon';
import times from 'lodash.times';
const daiImg = '/dai.png';

function getRandomInt(min, max, allPos) {
  min = Math.ceil(min);
  max = Math.floor(max);
  const val = Math.floor(Math.random() * (max - min + 1)) + min;
  return allPos ? val : getPosOrNeg(val);
}

function getPosOrNeg(val) {
  const mul = Math.random() < 0.5 ? -1 : 1;
  return val * mul;
}

function Plane({ position }) {
  const ref = useCannon({ mass: 0 }, body => {
    body.addShape(new CANNON.Plane());
    body.position.set(...position);
  });

  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[300, 300]} />
      <meshPhongMaterial attach="material" color="#fff" />
    </mesh>
  );
}

function Box({ position, index }) {
  const cylinderParams = [1, 1, 0.1, 10];

  const ref = useCannon({ mass: 5 }, body => {
    const shape = new CANNON.Cylinder(...cylinderParams);
    const quat = new CANNON.Quaternion();
    const translation = new CANNON.Vec3(0, 0, 0);
    const bodyAngle = Math.PI / getRandomInt(0, 180);
    const bodyAxis = new CANNON.Quaternion(
      getRandomInt(0, 50),
      getRandomInt(0, 80),
      getRandomInt(0, 50)
    );

    quat.setFromAxisAngle(new CANNON.Quaternion(1, 0, 0), -Math.PI / 2);
    shape.transformAllPoints(translation, quat);
    body.addShape(shape);
    body.position.set(...position);
    body.quaternion.setFromAxisAngle(bodyAxis, bodyAngle);
    // body.sleepSpeedLimit = 0.1;
  });

  const texture = useMemo(() => new THREE.TextureLoader().load(daiImg), [
    daiImg
  ]);

  texture.repeat.set(0.169, 0.75);
  texture.offset.set(0.009, 0.13);
  texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;

  return (
    <mesh ref={ref} castShadow receiveShadow index={index}>
      <cylinderGeometry attach="geometry" args={cylinderParams} />
      <meshLambertMaterial attach="material" transparent>
        <primitive attach="map" object={texture} />
      </meshLambertMaterial>
    </mesh>
  );
}

export default function DaiCoins({ dai, add }) {
  const count = 62 + add;
  const shapes = useMemo(() => {
    if (count) {
      return times(count, i => {
        return (
          <Box
            index={`coin-${i}`}
            position={[
              getRandomInt(0, 10),
              getRandomInt(0, 5),
              getRandomInt(20, 120, true)
            ]}
          />
        );
      });
    } else return null;
  }, [count]);

  return (
    <Canvas
      camera={{ position: [0, -7, 25], fov: 65 }}
      shadowMap
      onCreated={({ scene }) => {
        scene.rotation.set((Math.PI / 4.2) * -1, 0, 0);
      }}
    >
      <ambientLight intensity={0.8} />
      <spotLight
        intensity={0.4}
        position={[60, 60, 80]}
        angle={0.2}
        penumbra={1}
        castShadow
      />
      <Provider>
        <Plane position={[0, 0, -2]} />
        {shapes}
      </Provider>
    </Canvas>
  );
}
