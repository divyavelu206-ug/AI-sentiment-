import re
from collections import Counter
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Try importing transformers pipeline
try:
    from transformers import pipeline
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False


class SentimentAnalyzer:
    def __init__(self):
        print("Initializing SentimentAnalyzer...")
        self.vader = SentimentIntensityAnalyzer()
        self.hf_pipeline = None

        if HF_AVAILABLE:
            try:
                # Use a fast lightweight model for local sentiment classification
                print("Loading HuggingFace Transformers Sentiment Pipeline...")
                self.hf_pipeline = pipeline(
                    "sentiment-analysis",
                    model="distilbert-base-uncased-finetuned-sst-2-english",
                    device=-1  # CPU execution
                )
                print("HuggingFace Sentiment Pipeline loaded successfully!")
            except Exception as e:
                print(f"HuggingFace model load notice (using VADER fallback): {e}")
                self.hf_pipeline = None
        else:
            print("Transformers not installed. Using VADER sentiment analyzer.")

        # Keywords for Common Topics extraction
        self.topic_keywords = {
            "Food & Dining": ["food", "canteen", "cafeteria", "lunch", "breakfast", "dinner", "meal", "taste", "snack"],
            "Service & Support": ["service", "support", "help", "staff", "wait", "slow", "fast", "response", "assistance"],
            "Staff & Faculty": ["staff", "teacher", "professor", "faculty", "instructor", "mentor", "trainer", "employee"],
            "Quality & Value": ["quality", "standard", "value", "price", "cost", "worth", "money", "expensive", "cheap"],
            "Hostel & Infrastructure": ["hostel", "room", "bed", "bathroom", "building", "facility", "infrastructure", "dorm"],
            "Classroom & Lab": ["classroom", "class", "lab", "laboratory", "bench", "projector", "computer", "wifi", "internet"],
            "Events & Activities": ["event", "fest", "activity", "sports", "workshop", "seminar", "club"]
        }

    def analyze_single(self, text: str) -> dict:
        """
        Analyzes a single string entry and returns sentiment label and confidence score.
        Labels: Positive | Negative | Neutral
        """
        cleaned_text = text.strip()
        if not cleaned_text:
            return {"sentiment": "Neutral", "confidence": 50.0}

        # First calculate VADER score for neutral detection and fine scoring
        vader_scores = self.vader.polarity_scores(cleaned_text)
        compound = vader_scores["compound"]

        # Try Hugging Face pipeline if loaded
        if self.hf_pipeline:
            try:
                hf_res = self.hf_pipeline(cleaned_text[:512])[0]
                hf_label = hf_res["label"].upper()
                hf_score = float(hf_res["score"])

                # Handle neutral case using VADER threshold if compound is close to zero
                if -0.15 <= compound <= 0.15:
                    sentiment = "Neutral"
                    confidence = round((1.0 - abs(compound)) * 85.0, 1)
                elif "POSITIVE" in hf_label:
                    sentiment = "Positive"
                    confidence = round(max(hf_score * 100.0, (compound + 1) * 50.0), 1)
                else:
                    sentiment = "Negative"
                    confidence = round(max(hf_score * 100.0, (1 - compound) * 50.0), 1)

                return {
                    "text": cleaned_text,
                    "sentiment": sentiment,
                    "confidence": min(confidence, 99.9)
                }
            except Exception as e:
                print(f"HF Inference fallback to VADER: {e}")

        # VADER Pure Calculation (Fallback / Lightweight)
        if compound >= 0.25:
            sentiment = "Positive"
            confidence = round(50.0 + (compound * 48.0), 1)
        elif compound <= -0.25:
            sentiment = "Negative"
            confidence = round(50.0 + (abs(compound) * 48.0), 1)
        else:
            sentiment = "Neutral"
            # Neutral confidence calculation based on zero sentiment polarity
            confidence = round(65.0 + ((0.25 - abs(compound)) * 100.0), 1)

        return {
            "text": cleaned_text,
            "sentiment": sentiment,
            "confidence": min(confidence, 99.0)
        }

    def analyze_batch(self, feedback_list: list) -> dict:
        """
        Analyzes a batch of feedback strings and generates comprehensive statistics, topics, and insights.
        """
        results = []
        positive_count = 0
        negative_count = 0
        neutral_count = 0
        total_confidence = 0.0

        topic_counts = {topic: 0 for topic in self.topic_keywords}
        word_freq = Counter()

        # Stop words to ignore during word cloud / keyword extraction
        stop_words = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
            "is", "was", "were", "are", "be", "been", "it", "this", "that", "they", "i", "we",
            "you", "he", "she", "my", "our", "your", "very", "so", "too", "much", "more", "some",
            "good", "bad", "okay", "had", "have", "has", "not", "no", "all", "there", "their"
        }

        for idx, item in enumerate(feedback_list):
            if not isinstance(item, str):
                item = str(item) if item is not None else ""
            
            cleaned = item.strip()
            if not cleaned:
                continue

            analysis = self.analyze_single(cleaned)
            analysis["id"] = idx + 1
            results.append(analysis)

            # Metrics accumulators
            sent = analysis["sentiment"]
            if sent == "Positive":
                positive_count += 1
            elif sent == "Negative":
                negative_count += 1
            else:
                neutral_count += 1

            total_confidence += analysis["confidence"]

            # Topic matching
            lower_text = cleaned.lower()
            for topic, keywords in self.topic_keywords.items():
                if any(kw in lower_text for kw in keywords):
                    topic_counts[topic] += 1

            # Word frequency for common topics list
            words = re.findall(r'\b[a-zA-Z]{3,}\b', lower_text)
            for w in words:
                if w not in stop_words:
                    word_freq[w] += 1

        total = len(results)
        if total == 0:
            return {
                "results": [],
                "summary": {
                    "total": 0,
                    "positive_count": 0,
                    "positive_pct": 0.0,
                    "negative_count": 0,
                    "negative_pct": 0.0,
                    "neutral_count": 0,
                    "neutral_pct": 0.0,
                    "overall_sentiment": "Neutral",
                    "avg_confidence": 0.0,
                    "high_negative_alert": False
                },
                "topics": [],
                "insights": ["No feedback entries submitted for analysis."]
            }

        pos_pct = round((positive_count / total) * 100, 1)
        neg_pct = round((negative_count / total) * 100, 1)
        neu_pct = round((neutral_count / total) * 100, 1)
        avg_conf = round(total_confidence / total, 1)

        # Dominant sentiment determination
        if positive_count >= negative_count and positive_count >= neutral_count:
            overall_sentiment = "Positive"
        elif negative_count > positive_count and negative_count >= neutral_count:
            overall_sentiment = "Negative"
        else:
            overall_sentiment = "Neutral"

        high_negative_alert = neg_pct >= 30.0 or negative_count >= 5

        # Format topic list (include top keyword frequencies + mapped topic categories)
        extracted_topics = []
        for topic, count in topic_counts.items():
            if count > 0:
                extracted_topics.append({"topic": topic, "count": count})
        
        # Add top individual words if topic categories are sparse
        if len(extracted_topics) < 4:
            for word, count in word_freq.most_common(6):
                capitalized_word = word.capitalize()
                if not any(t["topic"].lower() == capitalized_word.lower() for t in extracted_topics):
                    extracted_topics.append({"topic": capitalized_word, "count": count})

        # Sort topics by count descending
        extracted_topics.sort(key=lambda x: x["count"], reverse=True)

        # Dynamic AI Insights generation
        insights = [
            f"Analyzed a total of {total} feedback responses.",
            f"Overall sentiment is predominantly {overall_sentiment} ({pos_pct}% Positive, {neg_pct}% Negative, {neu_pct}% Neutral).",
            f"The average model prediction confidence is {avg_conf}%."
        ]

        if extracted_topics:
            top_topic_names = ", ".join([t["topic"] for t in extracted_topics[:3]])
            insights.append(f"KEY RECURRING TOPICS: Core topics discussed by users include {top_topic_names}.")

        if high_negative_alert:
            insights.append(
                f"ATTENTION REQUIRED: High volume of negative feedback detected ({neg_pct}% of total responses). Review the 'Needs Attention' section immediately."
            )
        else:
            insights.append(
                "POSITIVE STATUS: Most feedback indicates high user satisfaction. Continue monitoring feedback channels for optimal performance."
            )

        # ---------------------------------------------------------
        # ADVANCED RISK ASSESSMENT (Grouped Negative Feedback Analysis)
        # ---------------------------------------------------------
        # Predefined Risk Intelligence Database
        risk_intelligence = {
            "Food & Dining": {
                "why": "Poor food quality directly impacts daily health, satisfaction, and morale. It is highly emotional and leads to chronic dissatisfaction.",
                "action": "Review catering vendor Service Level Agreements (SLAs) and hygiene standards.",
                "immediate": "Conduct random temperature and taste tests of the food being served today.",
                "long_term": "Form a committee to conduct weekly reviews of the canteen menu, pricing, and quality."
            },
            "Service & Support": {
                "why": "Slow or unhelpful support makes users feel ignored and unvalued, damaging the organization's reputation.",
                "action": "Audit response times and re-train frontline support staff on customer empathy.",
                "immediate": "Identify bottleneck tickets and assign a supervisor to resolve them immediately.",
                "long_term": "Implement an automated ticketing system with strict response time SLAs."
            },
            "Hostel & Infrastructure": {
                "why": "Infrastructure defects threaten safety, hygiene, and daily operational continuity.",
                "action": "Conduct a full facility audit and dispatch maintenance teams for critical repairs.",
                "immediate": "Send a rapid-response maintenance crew to fix the most reported broken plumbing or electrical issue today.",
                "long_term": "Establish a daily digital maintenance checklist and a scheduled hardware refresh cycle."
            },
            "Classroom & Lab": {
                "why": "Defective academic or lab environments disrupt the core learning process and cause massive frustration.",
                "action": "Inspect all classroom projectors, IT equipment, and lab connectivity.",
                "immediate": "Restart local network routers and replace faulty equipment in the highly reported rooms before the next session.",
                "long_term": "Install commercial-grade network nodes and mandate quarterly IT hardware audits."
            },
            "Default": {
                "why": "Repeated negative feedback indicates a systemic flaw in standard operations.",
                "action": "Investigate the root cause of these recurring complaints.",
                "immediate": "Acknowledge the feedback publicly and assure users that an investigation is underway.",
                "long_term": "Develop proactive policies to monitor and address this domain systematically."
            }
        }

        # Map Negative feedback to Topics
        negative_topics = {}
        for r in results:
            if r["sentiment"] == "Negative":
                lower_text = r["text"].lower()
                matched = False
                for topic, keywords in self.topic_keywords.items():
                    if any(kw in lower_text for kw in keywords):
                        if topic not in negative_topics:
                            negative_topics[topic] = 0
                        negative_topics[topic] += 1
                        matched = True
                        break # Only map to the first matched dominant topic
                if not matched:
                    if "Other Issues" not in negative_topics:
                        negative_topics["Other Issues"] = 0
                    negative_topics["Other Issues"] += 1

        # Generate Risk Analysis Output
        if negative_topics:
            insights.append("--- DEEP RISK ANALYSIS ON NEGATIVE FEEDBACK ---")
            
            # Sort by highest complaints first
            sorted_neg_topics = sorted(negative_topics.items(), key=lambda item: item[1], reverse=True)
            
            for topic, count in sorted_neg_topics:
                # Determine Risk Level
                if count >= 6:
                    risk_level = "🔴 Critical Risk"
                elif count >= 4:
                    risk_level = "🟠 High Risk"
                elif count >= 2:
                    risk_level = "🟡 Medium Risk"
                else:
                    risk_level = "🟢 Low Risk"

                # Fetch intelligence
                intel = risk_intelligence.get(topic, risk_intelligence["Default"])

                # Format exact string
                analysis_block = (
                    f"**Issue:** {topic}\n"
                    f"**Number of Reports:** {count}\n"
                    f"**Risk Level:** {risk_level}\n"
                    f"**Why It Is Risky:** {intel['why']}\n"
                    f"**Recommended Actions:** {intel['action']}\n"
                    f"**Immediate Action:** {intel['immediate']}\n"
                    f"**Long-Term Improvement:** {intel['long_term']}"
                )
                insights.append(analysis_block)

        return {
            "results": results,
            "summary": {
                "total": total,
                "positive_count": positive_count,
                "positive_pct": pos_pct,
                "negative_count": negative_count,
                "negative_pct": neg_pct,
                "neutral_count": neutral_count,
                "neutral_pct": neu_pct,
                "overall_sentiment": overall_sentiment,
                "avg_confidence": avg_conf,
                "high_negative_alert": high_negative_alert
            },
            "topics": extracted_topics[:8],
            "insights": insights
        }


# Global singleton analyzer instance
analyzer = SentimentAnalyzer()
