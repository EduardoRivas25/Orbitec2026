import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

type Props = {
  orientation: { pitch: number; roll: number; yaw: number };
  wireframe: boolean;
  showInternalPcb: boolean;
  showAxes: boolean;
};

function Honeycomb({ vertices, wireframe }: { vertices: Float32Array; wireframe: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const transform = new THREE.Object3D();
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < vertices.length; i += 6) {
      const a = new THREE.Vector3().fromArray(vertices, i);
      const b = new THREE.Vector3().fromArray(vertices, i + 3);
      transform.position.copy(a).add(b).multiplyScalar(.5);
      transform.quaternion.setFromUnitVectors(up, b.clone().sub(a).normalize());
      transform.scale.set(1, a.distanceTo(b), 1);
      transform.updateMatrix();
      mesh.current!.setMatrixAt(i / 6, transform.matrix);
    }
    mesh.current!.instanceMatrix.needsUpdate = true;
    mesh.current!.computeBoundingSphere();
  }, [vertices]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, vertices.length / 6]}>
    <cylinderGeometry args={[.012, .012, 1, 6]} />
    <meshStandardMaterial color="#39434d" roughness={.65} metalness={.3} wireframe={wireframe} />
  </instancedMesh>;
}

function Brace({ angle, sign, wireframe }: { angle: number; sign: number; wireframe: boolean }) {
  const path = useMemo(() => new THREE.CatmullRomCurve3(Array.from({ length: 33 }, (_, i) => {
    const t = i / 32;
    const theta = angle + sign * (t - .5) * .88;
    return new THREE.Vector3(.734 * Math.cos(theta), -1.40 + t * 2.8, .734 * Math.sin(theta));
  })), [angle, sign]);
  return <mesh><tubeGeometry args={[path, 32, .043, 6, false]} /><meshStandardMaterial color="#515a62" roughness={.6} metalness={.3} wireframe={wireframe} /></mesh>;
}

// Modelo ilustrativo: proporciones visuales, no dimensiones de fabricación.
export const CanSatAssembly = ({ orientation, wireframe, showInternalPcb, showAxes }: Props) => {
  const body = useRef<THREE.Group>(null);
  const honeycomb = useMemo(() => {
    const vertices: number[] = [];
    const radius = .72;
    const size = 2 * Math.PI * radius / (24 * Math.sqrt(3));
    for (let row = 0; row < 17; row++) {
      for (let column = 0; column < 24; column++) {
        const angle = (column + (row % 2) / 2) * 2 * Math.PI / 24;
        const y = -1.30 + row * size * 1.5;
        for (let side = 0; side < 6; side++) {
          for (const corner of [side, side + 1]) {
            const phi = Math.PI / 2 + corner * Math.PI / 3;
            const theta = angle + size * Math.cos(phi) / radius;
            vertices.push(radius * Math.cos(theta), y + size * Math.sin(phi), radius * Math.sin(theta));
          }
        }
      }
    }
    return new Float32Array(vertices);
  }, []);
  const spring = useMemo(() => new THREE.CatmullRomCurve3(Array.from({ length: 161 }, (_, i) => {
    const t = i / 160;
    return new THREE.Vector3(.075 * Math.cos(t * Math.PI * 14), t * .32, .075 * Math.sin(t * Math.PI * 14));
  })), []);
  const eggProfile = useMemo(() => Array.from({ length: 33 }, (_, i) => {
    const t = i / 32 * Math.PI;
    return new THREE.Vector2(.23 * Math.sin(t) * (1 + .16 * Math.cos(t)), -.32 * Math.cos(t));
  }), []);

  useFrame(() => {
    body.current?.rotation.set(THREE.MathUtils.degToRad(orientation.pitch), THREE.MathUtils.degToRad(orientation.yaw), THREE.MathUtils.degToRad(orientation.roll), 'YXZ');
  });

  const metal = <meshStandardMaterial color="#343e49" metalness={.45} roughness={.55} wireframe={wireframe} />;
  return <group ref={body}>
    {/* Aros de cierre y tapas de perfil bajo. */}
    {[-1.52, 1.52].map(y => <group key={y} position={[0, y, 0]}>
      <mesh><cylinderGeometry args={[.76, .76, .13, 64]} />{metal}</mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, y > 0 ? .075 : -.075, 0]}>
        <torusGeometry args={[.66, .018, 8, 64]} /><meshStandardMaterial color="#60788c" metalness={.4} roughness={.55} wireframe={wireframe} />
      </mesh>
      {[0, 1, 2].map(i => <mesh key={i} position={[0, .085, 0]} rotation={[0, i * Math.PI * 2 / 3, 0]}>
        <boxGeometry args={[.055, .035, 1.12]} />{metal}
      </mesh>)}
    </group>)}
    {!showInternalPcb && <Honeycomb vertices={honeycomb} wireframe={wireframe} />}
    {/* Refuerzos diagonales X distribuidos sobre el cilindro. */}
    {!showInternalPcb && [0, 1, 2, 3, 4, 5].map(panel => {
      const angle = panel * Math.PI / 3;
      return <group key={panel}>
        {[-1, 1].map(sign => <Brace key={sign} angle={angle} sign={sign} wireframe={wireframe} />)}
      </group>;
    })}
    {/* Varillas y separadores de las tres PCB, todas en la mitad superior. */}
    {[-.43, .43].flatMap(x => [-.35, .35].map(z => <group key={`${x}-${z}`}>
      <mesh position={[x, 0, z]}><cylinderGeometry args={[.019, .019, 2.9, 10]} />{metal}</mesh>
      {[.28, .69, 1.1].map(y => <mesh key={y} position={[x, y, z]}><cylinderGeometry args={[.038, .038, .12, 6]} /><meshStandardMaterial color="#cba35a" metalness={.55} roughness={.4} /></mesh>)}
    </group>))}
    {[.25, .66, 1.07].map((y, level) => <group key={y} position={[0, y, 0]}>
      <mesh><cylinderGeometry args={[.59, .59, .035, 8]} /><meshStandardMaterial color="#164337" roughness={.7} wireframe={wireframe} /></mesh>
      <mesh position={[0, .065, 0]}><boxGeometry args={[.28, .09, .3]} /><meshStandardMaterial color={level === 2 ? '#7c8996' : '#10151b'} metalness={.35} roughness={.5} wireframe={wireframe} /></mesh>
      {[-1, 1].flatMap(side => [0, 1, 2, 3].map(i => <mesh key={`${side}-${i}`} position={[side * .26, .035, -.22 + i * .14]}>
        <boxGeometry args={[.07, .04, .04]} /><meshStandardMaterial color="#d4ae64" roughness={.5} />
      </mesh>))}
      <Line points={[[-.4, .023, -.16], [-.3, .023, -.16], [-.3, .023, .28], [.24, .023, .28]]} color="#59bc9d" lineWidth={1} />
      <mesh position={[.32, .055, .2]}><sphereGeometry args={[.018, 8, 8]} /><meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2} /></mesh>
    </group>)}
    {/* Cuatro resortes soportan la caja del tripulante. */}
    {[-.3, .3].flatMap(x => [-.3, .3].map(z => <group key={`spring-${x}-${z}`} position={[x, -1.39, z]}>
      <mesh><tubeGeometry args={[spring, 160, .014, 6, false]} /><meshStandardMaterial color="#b5c7d8" metalness={.65} roughness={.3} wireframe={wireframe} /></mesh>
      <mesh position={[0, .015, 0]}><cylinderGeometry args={[.105, .105, .035, 20]} />{metal}</mesh>
    </group>))}
    <group position={[0, -.99, 0]}>
      <mesh><boxGeometry args={[.79, .09, .79]} /><meshStandardMaterial color="#49735d" wireframe={wireframe} /></mesh>
      {[-1, 1].map(side => <mesh key={side} position={[side * .36, .23, 0]}><boxGeometry args={[.06, .44, .72]} /><meshStandardMaterial color="#49735d" roughness={.65} wireframe={wireframe} /></mesh>)}
      <mesh position={[0, .09, -.36]}><boxGeometry args={[.72, .15, .06]} /><meshStandardMaterial color="#49735d" wireframe={wireframe} /></mesh>
      <mesh position={[0, .09, .36]}><boxGeometry args={[.72, .15, .06]} /><meshStandardMaterial color="#49735d" wireframe={wireframe} /></mesh>
      <mesh position={[0, .07, 0]}><boxGeometry args={[.64, .05, .64]} /><meshStandardMaterial color="#263c3b" roughness={1} /></mesh>
      <mesh position={[0, .41, 0]}><latheGeometry args={[eggProfile, 40]} /><meshStandardMaterial color="#e2ba7c" roughness={.7} wireframe={wireframe} /></mesh>
    </group>
    {showAxes && <axesHelper args={[2]} />}
  </group>;
};
