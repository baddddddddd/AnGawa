import spacy


class QuizItem:
    def __init__(self, item, answer) -> None:
        self.item = item
        self.answer = answer

    
    def __str__(self):
        return f"{self.item} - {self.answer}"
    

'''
Main Functions:
- Identify and extract important information from a text if there is
    [x] Extract main subject from a sentence
    [ ] Extract dates from a sentence
    [ ] Extract objects from the sentence
    [ ] Identify coreference

- Create different types of exam questions using the extracted information
    [x] Fill in the blanks
    [ ] Identification
    [ ] Question generation
    [ ] True or False
    [ ] Enumeration
    [ ] Matching type

- Question generation algo
    1. If subject is the first token in the sentence, use Wh- questions.
    2. If the subject is the middle of the sentence, use fill in the blanks.
'''
class QuizGenerator:
    INTERROGATIVES = {
        "CARDINAL": "",
        "DATE": "when",
        "EVENT": "",
        "FAC": "",
        "GPE": "where",
        "LANGUAGE": "",
        "LAW": "",
        "LOC": "",
        "MONEY": "",
        "NORP": "",
        "ORDINAL": "",
        "ORG": "what organization",
        "PERCENT": "",
        "PERSON": "who",
        "PRODUCT": "",
        "QUANTITY": "",
        "TIME": "",
        "WORK_OF_ART": "",
        "": "what",
    }


    def __init__(self) -> None:
        self.nlp = spacy.load("en_core_web_sm")
    
    
    def to_phrases(self, doc):
        # Merge noun phrases
        with doc.retokenize() as retokenizer:
            for chunk in doc.noun_chunks:
                retokenizer.merge(chunk)


        # Merge punctuations
        with doc.retokenize() as retokenizer:
            for i in range(len(doc) - 1):
                if doc[i + 1].is_punct:
                    retokenizer.merge(doc[i:i + 2])

        return doc
    

    def to_true_or_false(self, sentence):
        pass


    # Can only handle main subjects
    def to_fill_in_the_blank(self, sentence):
        tokens = []

        answer = ""

        for token in sentence:
            if "subj" in token.dep_ and not token.is_stop:
                answer = token.text
                tokens.append("________")
            else:
                tokens.append(token.text)

        blankified = " ".join(tokens)   

        return QuizItem(blankified, answer)


    # Assumes noun phrases are merged
    def extract_subject(self, sentence):
        for token in sentence:
            if "subj" in token.dep_:
                return token
            
        return None


    def to_question(self, sentence):
        subject = self.extract_subject(sentence)

        if subject is None:
            return None
        
        tokens = []
        for token in sentence:
            if token == subject:
                tokens.append(self.INTERROGATIVES[subject.ent_type_])
            else:
                tokens.append(token.text)

        question = " ".join(tokens).capitalize()

        if question[-1] == ".":
            question[-1] == "?"
        else:
            question += "?"

        return QuizItem(question, subject.text)


    def to_identification(self, sentence):
        subject = self.extract_subject(sentence)

        if subject is None:
            return None


    def generate_questions(self, paragraph: str):
        doc = self.to_phrases(self.nlp(paragraph))

        result = []

        for sentence in doc.sents:
            item = self.to_question(sentence)
            result.append(item)

        return result
    