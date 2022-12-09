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

const x =     [
  { "mode": "NULLABLE",  "name": "date", "type": "DATE"},
  {
    "fields": [
      { "mode": "NULLABLE", "name": "country", "type": "STRING"},
      { "mode": "NULLABLE", "name": "ZipCode", "type": "STRING"},
    ],
    "mode": "NULLABLE",  "name": "location", "type": "RECORD"
  },
  { "mode": "REPEATED",  "name": "timestamps", "type": "TIMESTAMP"},
  {
    "fields": [
      { "mode": "NULLABLE", "name": "id", "type": "INTEGER"},
      { "mode": "NULLABLE", "name": "name", "type": "STRING"},
    ],
    "mode": "REPEATED",  "name": "users", "type": "RECORD"
  },
]

