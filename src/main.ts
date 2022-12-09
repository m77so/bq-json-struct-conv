import { BqJsonSchema, generateSelect } from './converter'
import { BqJsonSchemaValidator } from './validator'

function setConverter(
  button_element:HTMLButtonElement,
  input_element: HTMLTextAreaElement,
  output_element: HTMLTextAreaElement,
  message_element: HTMLDivElement
) {
  button_element.addEventListener('click', ()=>{
    const input_str = input_element.value
    let is_valid = false;
    message_element.innerText = ""
    try{
      is_valid = BqJsonSchemaValidator.check(JSON.parse(input_str))
    } catch(e){
      console.log(e)
      message_element.innerHTML = (e as Error).toString()
    }
    if (!is_valid) {
      message_element.innerHTML += "<br> 無効なJSONです。どこかが違います"
      output_element.value = ""
      return
    }
    output_element.value = generateSelect(JSON.parse(input_str) as BqJsonSchema, 'jsoncol.')
    
  })
}


setConverter(
  document.querySelector<HTMLButtonElement>('#convert')!,
  document.querySelector<HTMLTextAreaElement>('#json_input')!,
  document.querySelector<HTMLTextAreaElement>('#query_output')!,
  document.querySelector<HTMLDivElement>("#message")!
)
