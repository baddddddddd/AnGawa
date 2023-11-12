import spacy

import random


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
    [x] Extract dates from a sentence
    [x] Extract objects from the sentence
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
    

    # Merge noun phrases into a single token
    def merge_noun_phrases(self, doc):
        with doc.retokenize() as retokenizer:
            for noun_phrase in doc.noun_chunks:
                retokenizer.merge(noun_phrase)


    # Merge entity phrases into a single token
    def merge_entity_phrases(self, doc):
        with doc.retokenize() as retokenizer:
            for entity in doc.ents:
                retokenizer.merge(entity)


    # Merge punctuations into a single token
    def merge_punctuations(self, doc, exceptions=[]):
        spans = []
        for word in doc[:-1]:
            if word.is_punct or not word.nbor(1).is_punct:
                continue
            start = word.i
            end = word.i + 1
            while end < len(doc) and doc[end].is_punct:
                end += 1
            span = doc[start:end]
            spans.append((span, word.tag_, word.lemma_, word.ent_type_))

        with doc.retokenize() as retokenizer:
            for span, tag, lemma, ent_type in spans:
                attrs = {"tag": tag, "lemma": lemma, "ent_type": ent_type}
                retokenizer.merge(span, attrs=attrs)

        return doc


    def resolve_coreferences(self, doc):
        pass


    def extract_subject(self, sentence, include_stop_words=False):
        if include_stop_words:
            for token in sentence:
                if "subj" in token.dep_:
                    return token
        else:     
            for token in sentence:
                if "subj" in token.dep_ and not token.is_stop:
                    return token
        
        return None
    

    def extract_object(self, sentence, include_stop_words=False):
        if include_stop_words:
            for token in sentence:
                if "obj" in token.dep_:
                    return token
        else:
            for token in sentence:
                if "obj" in token.dep_ and not token.is_stop:
                    return token


    def to_fill_in_the_blanks(self, doc):
        self.merge_noun_phrases(doc)
        self.merge_entity_phrases(doc)

        answers = []

        for i, sentence in enumerate(doc.sents):
            answer = random.choice([self.extract_subject, self.extract_object])(sentence)

            if answer is not None:
                answers.append(answer)

        new_sentence = ""
        for token in doc:
            if token in answers:
                new_sentence += "__________" + token.whitespace_
            else:
                new_sentence += token.text_with_ws

        return QuizItem(new_sentence, answers)


    def to_matching_type(self, doc):
        pass
    

    def to_true_or_false(self, sentence):
        pass


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
    

# example = "Vlad was born on September 18, 2004. Abraham Lincoln, the 16th President of the United States, played a crucial role in leading the nation through the Civil War. Born in 1809 in a log cabin in Kentucky, Lincoln rose from humble beginnings to become one of America's most revered leaders. His Emancipation Proclamation in 1863 declared the freedom of all slaves in Confederate-held territory, a landmark moment in the fight against slavery. Lincoln's Gettysburg Address, delivered in 1863, is considered one of the greatest speeches in American history. Unfortunately, Lincoln's presidency was cut short when he was assassinated by John Wilkes Booth in 1865."
# gen = QuizGenerator()
# doc = gen.nlp(example)
# 
# 
# gen.to_flashcards(doc)