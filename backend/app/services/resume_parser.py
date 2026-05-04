import re


def extract_features_from_resume(text: str):
    # experience extraction
    exp_match = re.findall(r'(\d+)\+?\s+years', text.lower())
    experience = float(exp_match[0]) if exp_match else 0

    # skills extraction
    skills_list = ["python", "machine learning", "sql", "react"]
    found_skills = [s for s in skills_list if s in text.lower()]

    return {
        "experience_years": experience,
        "skills": found_skills
    }