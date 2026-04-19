export const runGeminiMatch = async (need, volunteers, apiKey) => {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const prompt = `
You are a volunteer coordinator AI expert. 
Given this community need:
${JSON.stringify({ ...need, id: undefined })}

And these available volunteers:
${JSON.stringify(volunteers.map(v => ({...v, id: v.id, name: v.name, skills: v.skills, zone: v.zone, availability: v.availability})))}

Return a JSON array of the top 3 best volunteer matches, ranked by fit.
Each item should have: "volunteer_id", "score" (1-10), "reason" (1 concise sentence explaining exactly why they fit the need's skills and location).

Return ONLY valid JSON array. No markdown, no explanation outside the array.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      }
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Failed to fetch from Gemini');
  }

  const data = await response.json();
  const textContent = data.candidates[0].content.parts[0].text;
  
  try {
    return JSON.parse(textContent);
  } catch (e) {
    throw new Error("Failed to parse Gemini output as JSON");
  }
};
