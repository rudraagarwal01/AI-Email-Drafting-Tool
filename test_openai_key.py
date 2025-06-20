import openai

# Replace with your actual API key
openai.api_key = "sk-..."

try:
    models = openai.models.list()
    print("✅ Success! Your API key is working.")
    print("Available models:", [m.id for m in models.data])
except Exception as e:
    print("❌ Error:", e)

