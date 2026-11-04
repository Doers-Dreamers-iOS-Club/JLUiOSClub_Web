import assert from 'node:assert/strict'
import { build } from 'esbuild'
import fs from 'node:fs/promises'
const load = async entry => {
  const result = await build({ entryPoints: [entry], bundle: true, write: false, format: 'esm', platform: 'node' })
  return import('data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64'))
}
const current = await load('.vitepress/theme/ascii/myth-motion.ts')
const baseline = process.argv[2] ? await load(process.argv[2]) : null
const read = name => fs.readFile(`.vitepress/theme/ascii/creation/${name}.json`, 'utf8').then(JSON.parse)
function points(data, width, hand) {
  const scale = hand ? width / data.cols : width * .38 / data.cols
  return data.lines.flatMap((line, row) => [...line].flatMap((char, col) => char === ' ' ? [] : [{
    x: col * scale + (hand ? 0 : width * .12), y: 140 + row * scale / .6,
    char, size: scale / .6, alpha: 1, u: col / data.cols, v: row / data.rows,
    part: data.parts ? Number(data.parts[row][col]) : 0
  }]))
}
const key = p => `${p.x.toFixed(4)},${p.y.toFixed(4)},${p.char}`
for (const width of [1440, 390]) {
  const mobile = width < 700 ? '-mobile' : ''
  const hands = points(await read('hands' + mobile), width, true)
  const fire = points(await read('prometheus' + mobile), width, false)
  const flameCount = fire.filter(p => p.part === 1).length
  const supportCount = fire.length - flameCount
  const boat = points(await read('argo' + mobile), width, false)
  const forward = current.mythTransition(1, 2, hands, fire, width)
  const reverse = current.mythTransition(2, 1, fire, hands, width)
  assert.equal(forward.kind, 'hands-sand')
  assert.deepEqual(forward.frame(0), hands); assert.deepEqual(forward.frame(1), fire)
  assert.deepEqual(reverse.frame(0), fire); assert.deepEqual(reverse.frame(1), hands)
  const held = new Set(forward.frame(.2).filter(p => p.alpha === 1).map(key))
  const left = hands.filter(p => p.x < width * .25), right = hands.filter(p => p.x > width * .9)
  assert(left.every(p => held.has(key(p))), 'The un-eroded left silhouette must stay solid, not globally fade')
  assert(right.some(p => !held.has(key(p))), 'The right side must physically erode first')
  const forming = new Set(reverse.frame(.55).filter(p => p.alpha === 1).map(key))
  assert(left.filter(p => forming.has(key(p))).length / left.length > .8, 'Return must build the left hand first')
  assert(right.filter(p => forming.has(key(p))).length / right.length < .2, 'Right-hand sand must still be flowing while the left is formed')
  for (const t of [.25, .5, .75]) {
    const frame = forward.frame(t)
    assert(frame.every(p => Number.isFinite(p.x) && Number.isFinite(p.y) && p.size > 0 && p.alpha >= 0 && p.alpha <= 1))
    assert(frame.filter(p => p.alpha > .2).length >= Math.min(hands.length, fire.length) * .7, 'Keep sand visibly in motion throughout the transfer')
    assert(frame.length <= Math.max(hands.length, supportCount) * 2 + flameCount, 'Bound sand and spark rendering cost')
    assert.deepEqual(frame.filter(p => p.alpha > .25), reverse.frame(1 - t).filter(p => p.alpha > .25), 'Reverse the grain paths, only changing trail direction')
  }
  if (baseline) {
    for (const [a,b,source,target] of [[1,2,hands,fire],[2,1,fire,hands]]) {
      for (const t of [.08,.25,.5,.75,.95]) {
        assert.deepEqual(
          current.mythTransition(a,b,source,target,width).frame(t).filter(p => p.part === 1),
          baseline.mythTransition(a,b,source,target,width).frame(t).filter(p => p.part === 1),
          'Preserve the fingertip spark and its original flame path; sand only becomes the supporting arm and torch'
        )
      }
    }
    for (const [a,b,source,target] of [[2,3,fire,boat],[3,2,boat,fire]]) {
      for (const t of [0,.15,.45,.8,1]) assert.deepEqual(current.mythTransition(a,b,source,target,width).frame(t), baseline.mythTransition(a,b,source,target,width).frame(t), 'Fire/sail transition must remain byte-for-byte equivalent')
    }
    for (const time of [0,1,3]) {
      assert.deepEqual(current.flamePose(fire[0],time,0,400),baseline.flamePose(fire[0],time,0,400))
      assert.deepEqual(current.torchLight(fire[0],time,.42),baseline.torchLight(fire[0],time,.42))
    }
  }
  console.log(`PASS ${width}px: endpoints, erosion, left-to-right accumulation, persistent grains, bounded cost${baseline ? ', unchanged fingertip spark, fire/sail and flame motion' : ''}`)
}
