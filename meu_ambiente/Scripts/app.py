#importar bibliotecas
from pyalex import Works
import os
from google.cloud import texttospeech
import speech_recognition as sr
import spacy
import time
import regex as re


nlp = spacy.load("pt_core_news_sm")

from dotenv import load_dotenv

load_dotenv()

# Carregar o caminho da chave JSON
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:\\Users\\User\\Documents\\capes\\meu_ambiente\\animated-tracer-441904-d6-14d7e3815934.json"

# Inicializar clientes
tts_client = texttospeech.TextToSpeechClient()
recognizer = sr.Recognizer()



def falar(texto):
    """Converte texto em fala usando Google Text-to-Speech."""
    synthesis_input = texttospeech.SynthesisInput(text=texto)
    voice = texttospeech.VoiceSelectionParams(
        language_code="pt-BR",
        ssml_gender=texttospeech.SsmlVoiceGender.FEMALE
    )
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.LINEAR16)

    response = tts_client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config
    )


    with open("resposta.wav", "wb") as out:
        out.write(response.audio_content)
    print(f"[Assistente]: {texto}")
    os.system("start resposta.wav")  
    time.sleep(8)

def ouvir():
    """Captura áudio do usuário e retorna o texto."""
    with sr.Microphone() as source: 
        print("[Assistente]: Estou ouvindo...")
        try:
            audio = recognizer.listen(source)
            texto = recognizer.recognize_google(audio, language="pt-BR")
            print(f"[Usuário]: {texto}")
            return texto
        except sr.UnknownValueError:
            print("[Assistente]: Não consegui entender. Pode repetir?")
            return ouvir()
        except sr.RequestError as e:
            print(f"[Assistente]: Erro na API de reconhecimento de fala: {e}")
            return None

    

def fazer_perguntas():
    """Faz perguntas ao usuário e retorna as respostas."""
    respostas = []

    falar("Olá! Sou seu assistente de pesquisa. Qual o tema principal da sua pesquisa?")
    resposta1 = ouvir()

    pergunta2 = f"Entendi. Está buscando artigos sobre {resposta1}. Deseja adicionar alguma palavra-chave?"
    falar(pergunta2)
    resposta2 = ouvir()
    doc = nlp(resposta2)  # Processa o texto com o modelo spaCy
    termos_principais = [token.text for token in doc if not token.is_stop and token.is_alpha]
    resposta_processada = " ".join(termos_principais)
    respostas.append(resposta_processada)

    falar("Ótimo! Estou buscando por artigos sobre isso. Gostaria de resultados para qual período?")
    resposta3 = ouvir()
    # Processar a resposta com spaCy para extrair os anos
    anos = re.findall(r'\b\d{4}\b', resposta3)
    resposta_formatada = " - ".join(anos)
    respostas.append(resposta_formatada)


    falar("Gostaria dos resultados em qual idioma?")
    while True:
      resposta4 = ouvir().strip().lower()  # Captura e normaliza a resposta
      idiomas_validos = {"português", "inglês", "espanhol", "francês"}  # Idiomas suportados
      if resposta4 in idiomas_validos:
        respostas.append(resposta4)
        break  # Sai do loop se o idioma for válido 
      else:
        falar("Ainda não indexamos esse idioma. Poderia responder entre Português, inglês, espanhol ou francês?")

    resumo_respostas = ", ".join([resposta for resposta in respostas if resposta])
    falar(f"Perfeito! Estarei buscando artigos sobre: {resumo_respostas}.")
    print(f"Respostas coletadas: {respostas}")
    return respostas

def buscar_trabalhos(respostas):
    """Busca trabalhos usando as respostas do usuário."""
    try:
        query = " AND ".join([f'"{resposta}"' for resposta in respostas if resposta])  # Adiciona aspas às respostas
        print(f"Consulta gerada: {query}") 

        if not query:
            print("Não foram fornecidas informações suficientes para realizar a busca.")
            return []


        search_results = Works().search(query).get(per_page=100) 
        if not search_results:
            print("Nenhum resultado encontrado.")
            return []

        # Ordenar os resultados pelos mais citados e selecionar os 5 primeiros
        top_cited = sorted(search_results, key=lambda x: x.get('cited_by_count', 0), reverse=True)[:5]

        return top_cited

    except Exception as e:
        print("Ocorreu um erro ao buscar os resultados. Tente novamente mais tarde.")
        print(f"Erro ao buscar trabalhos: {e}")
        return []

def exibir_resultados(resultados):
    """Exibe os resultados da busca de forma formatada."""
    if resultados:
        print("Aqui estão os 5 artigos mais citados:")
        for trabalho in resultados:
            titulo = trabalho.get('title', 'Título não disponível')
            autores = ", ".join([author.get('display_name', 'Autor desconhecido') for author in trabalho.get('authorships', [])])
            citacoes = trabalho.get('cited_by_count', 0)
            print(f"Título: {titulo}")
            print(f"Autores: {autores}")
            print(f"Número de citações: {citacoes}")
            print("-" * 40)
    else:
        print("Nenhum resultado encontrado.")



if __name__ == "__main__":
    try:
        # Etapas
        respostas = fazer_perguntas()
        if not respostas:
            falar("Não foi possível obter respostas. Encerrando o assistente.")
            exit()

        resultados = buscar_trabalhos(respostas)
        if not resultados:
            falar("Nenhum resultado encontrado para os critérios fornecidos. Encerrando o assistente.")
            exit()

        exibir_resultados(resultados)

    except Exception as e:
        falar("Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.")
        print(f"Erro: {e}")
        exit()

