const Alexa = require('ask-sdk-core')
const axios = require('axios')

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
    )
  },
  handle(handlerInput) {
    const speakOutput = 'The truth about Cats and Dogs'
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}
async function getFacts(animal) {
  if (animal === 'dogs') {
    animal = 'dog'
  }
  if (animal === 'cats') {
    animal = 'cat'
  }

  const results = await axios.get(`https://cat-fact.herokuapp.com/facts/random?animal_type=${animal}&amount=1`)
  return results.data.text

}

const AnimalIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'CatIntent'
    )
  },
  async handle(handlerInput) {
    const animal = handlerInput.requestEnvelope.request.intent.slots.Animal.value
    const answer = await getFacts(animal)
    const reprompt = 'If you would like another fact say cat or dog!'

    return handlerInput.responseBuilder
      .speak(answer + ' ' + reprompt)
      .reprompt(reprompt)
      .withShouldEndSession(false)
      .getResponse()
  }
}
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    )
  },
  handle(handlerInput) {
    const speakOutput = 'You can ask me to tell you a fact about cats or dogs'

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}

const NoIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NoIntent'
    )
  },
  handle(handlerInput) {

    const answer = "Thank you! Come back soon."

    return handlerInput.responseBuilder
      .speak(answer)
      .withShouldEndSession(true)
      .getResponse()
  }
}
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      (Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.CancelIntent' ||
        Alexa.getIntentName(handlerInput.requestEnvelope) ===
        'AMAZON.StopIntent')
    )
  },
  handle(handlerInput) {
    const speakOutput = 'Goodbye!'
    return handlerInput.responseBuilder.speak(speakOutput).getResponse()
  }
}
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) ===
      'SessionEndedRequest'
    )
  },
  handle(handlerInput) {

    return handlerInput.responseBuilder.getResponse()
  }
}

const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
    )
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope)
    const speakOutput = `You just triggered ${intentName} `

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        .getResponse()
    )
  }
}


const ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handlerInput, error) {
    console.log(`~~~~Error handled: ${error.stack} `)
    const speakOutput = `Sorry, I had trouble doing what you asked.Please try again.`

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}


exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    AnimalIntentHandler,
    HelpIntentHandler,
    NoIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda()
