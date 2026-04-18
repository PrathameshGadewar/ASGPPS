from typing import Dict

def get_market_trends(domain: str) -> Dict:
    """
    Stub for Market Trend Intelligence using mocked news metrics.
    In production, this queries Google News API or an LLM summary endpoint.
    """
    domain_lower = domain.lower()
    
    base_growth = 15
    if "ai" in domain_lower or "machine learning" in domain_lower:
        base_growth = 35
    elif "cyber" in domain_lower or "security" in domain_lower:
        base_growth = 28
    elif "data" in domain_lower:
        base_growth = 22
        
    return {
        "domain": domain,
        "predicted_5yr_growth": f"+{base_growth}%",
        "salary_growth_trend": "Highly Positive",
        "top_keywords": ["GenAI", "Cloud Security", "Prompt Engineering"]
    }
