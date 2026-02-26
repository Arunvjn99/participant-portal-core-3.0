/**
 * Core AI - Voice assistant screen (from participant portal)
 *
 * Usage:
 *   import BellaScreen from './bella';
 *
 *   <BellaScreen onClose={() => navigate('/dashboard')} />
 *
 * Host app must:
 * - Core AI goes through /api/core-ai with session token (no frontend API keys)
 * - Browser SpeechRecognition and speechSynthesis (Chrome, Safari, Edge)
 */
export { default as BellaScreen } from "./BellaScreen";
export type { BellaScreenProps, BellaLayoutVariant } from "./BellaScreen";
