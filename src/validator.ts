import { j } from 'typist-json'


const BqJsonTypes = j.any([
  j.literal('INTEGER'),
  j.literal('STRING'),
  j.literal('DATE'),
  j.literal('TIMESTAMP')
])

const BqJsonSchemaElemDefault = j.object({
  name: j.string,
  mode: j.any([
    j.literal('REPEATED'),
    j.literal('NULLABLE'),
    j.literal('REQUIRED')
  ]),
  type: BqJsonTypes,
  "description?": j.string
})

const BqJsonSchemaElemRecord = j.object({
  name: j.string,
  mode: j.any([
    j.literal('REPEATED'),
    j.literal('NULLABLE'),
    j.literal('REQUIRED')
  ]),
  type: j.literal('RECORD'),
  "description?": j.string,
  fields: () => j.array(BqJsonSchemaElem)
})

const BqJsonSchemaElem = j.any([
  BqJsonSchemaElemDefault,
  BqJsonSchemaElemRecord
])

export const BqJsonSchemaValidator = j.array(BqJsonSchemaElem)

