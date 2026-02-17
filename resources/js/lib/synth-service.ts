/**
 * SynthService: A lightweight utility to generate synth sounds using the Web Audio API.
 * No external audio files required.
 */

class SynthService {
    private ctx: AudioContext | null = null;

    private getContext(): AudioContext {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.ctx;
    }

    private createOscillator(freq: number, type: OscillatorType = 'sine'): { osc: OscillatorNode; gain: GainNode } {
        const ctx = this.getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        return { osc, gain };
    }

    /**
     * Play a soft "pop" or "blip" sound
     */
    playPop() {
        try {
            const { osc, gain } = this.createOscillator(440, 'sine');
            const ctx = this.getContext();

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.1);

            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.warn('Audio play failed:', e);
        }
    }

    /**
     * Play a rising success arpeggio/bloom
     */
    playSuccess() {
        try {
            const ctx = this.getContext();
            const now = ctx.currentTime;
            const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

            freqs.forEach((freq, i) => {
                const { osc, gain } = this.createOscillator(freq, 'sine');
                const startTime = now + i * 0.05;

                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.3);

                osc.start(startTime);
                osc.stop(startTime + 0.3);
            });
        } catch (e) {
            console.warn('Audio play failed:', e);
        }
    }

    /**
     * Play a celebratory fanfare
     */
    playFanfare() {
        try {
            const ctx = this.getContext();
            const now = ctx.currentTime;

            // Major chord
            [523.25, 659.25, 783.99].forEach((freq) => {
                const { osc, gain } = this.createOscillator(freq, 'triangle');

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 1);

                osc.start(now);
                osc.stop(now + 1);
            });
        } catch (e) {
            console.warn('Audio play failed:', e);
        }
    }
}

export const synth = new SynthService();
