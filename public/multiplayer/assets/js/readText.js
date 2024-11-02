class TextToSpeech {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voiceList = [];
        this.colombianVoice = null;
        this.isReady = false;

        // Configuración por defecto
        this.defaultConfig = {
            rate: 1.0,
            pitch: 1.0,
            volume: 1.0
        };

        // Inicializar voces
        this.initVoices();
    }

    initVoices() {
        const loadVoices = () => {
            this.voiceList = this.synth.getVoices();
            this.colombianVoice = this.voiceList.find(voice => 
                voice.name.toLowerCase().includes('gonzalo') && 
                voice.lang.includes('es') && 
                voice.name.toLowerCase().includes('colombia')
            );
            this.isReady = true;
        };

        // Cargar voces cuando estén disponibles
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }
        loadVoices(); // Intento inicial de carga
    }

    speak(text, options = {}) {
        return new Promise((resolve, reject) => {
            if (this.synth.speaking) {
                this.synth.cancel();
            }

            const utterance = new SpeechSynthesisUtterance(text);
            
            // Configurar la voz
            if (this.colombianVoice) {
                utterance.voice = this.colombianVoice;
            } else {
                const spanishVoice = this.voiceList.find(voice => voice.lang.includes('es'));
                if (spanishVoice) {
                    utterance.voice = spanishVoice;
                }
            }

            // Aplicar configuración
            utterance.rate = options.rate || this.defaultConfig.rate;
            utterance.pitch = options.pitch || this.defaultConfig.pitch;
            utterance.volume = options.volume || this.defaultConfig.volume;

            // Eventos
            utterance.onend = () => resolve();
            utterance.onerror = (error) => reject(error);

            this.synth.speak(utterance);
        });
    }

    pause() {
        this.synth.pause();
    }

    resume() {
        this.synth.resume();
    }

    stop() {
        this.synth.cancel();
    }

    getVoices() {
        return this.voiceList;
    }

    getCurrentVoice() {
        return this.colombianVoice;
    }

    setConfig(config) {
        this.defaultConfig = {
            ...this.defaultConfig,
            ...config
        };
    }

    isVoiceReady() {
        return this.isReady;
    }
}

export default TextToSpeech