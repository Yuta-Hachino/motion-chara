import React from 'react';
import { Live2DCharacterProps } from './types';
/**
 * Live2D Character Component
 *
 * A React component that displays a Live2D model with lip-sync and blinking animations.
 *
 * @example
 * ```tsx
 * import { Live2DCharacter } from 'react-live2d-lipsync';
 *
 * function App() {
 *   const [audioVolume, setAudioVolume] = useState(0);
 *
 *   return (
 *     <Live2DCharacter
 *       modelPath="/models/character.model3.json"
 *       audioVolume={audioVolume}
 *       positionY={-0.3}
 *       scale={1.2}
 *     />
 *   );
 * }
 * ```
 */
export declare const Live2DCharacter: React.FC<Live2DCharacterProps>;
//# sourceMappingURL=Live2DCharacter.d.ts.map