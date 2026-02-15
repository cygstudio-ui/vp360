// La clave se debería inyectar mediante variables de entorno en producción
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

export const callGemini = async (prompt) => {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || "API Error");
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Lo siento, la red neuronal de VP está saturada en este momento (Verifica tu API KEY). Intenta de nuevo.";
    }
};
