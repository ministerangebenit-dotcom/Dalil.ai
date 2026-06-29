import requests

# 🔁 Replace this with your REAL Railway backend URL
BACKEND_URL = "https://your-app.up.railway.app/chat"

# 🧪 Test dataset (you can expand this later)
test_cases = [
    {
        "input": "What is PATNUC in Cameroon?",
        "expected_contains": "Cameroon"
    },
    {
        "input": "Who is the president of Cameroon?",
        "expected_contains": "Paul Biya"
    },
    {
        "input": "What is Yaoundé?",
        "expected_contains": "capital"
    },
    {
        "input": "What is the Ministry of Finance Cameroon?",
        "expected_contains": "ministry"
    }
]

def run_tests():
    total = len(test_cases)
    correct = 0

    for case in test_cases:
        try:
            response = requests.post(
                BACKEND_URL,
                json={"message": case["input"]},
                timeout=10
            )

            data = response.json()
            answer = data.get("answer", "")

            print("\nQUESTION:", case["input"])
            print("ANSWER:", answer)

            if case["expected_contains"].lower() in answer.lower():
                print("STATUS: ✅ PASS")
                correct += 1
            else:
                print("STATUS: ❌ FAIL")

        except Exception as e:
            print("\nQUESTION:", case["input"])
            print("ERROR:", str(e))
            print("STATUS: ❌ FAIL (request error)")

    print("\n====================")
    print(f"ACCURACY: {correct}/{total} = {correct/total:.2%}")
    print("====================")

if __name__ == "__main__":
    run_tests()
