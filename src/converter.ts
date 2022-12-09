type BqJsonSchemaElemBase = {
  name: string,
  mode: "REPEATED" | "NULLABLE" | "REQUIRED",
  description?: string
}
type BqJsonTypes =  "INTEGER" | "STRING" | "DATE" | "TIMESTAMP" // 他にも型が続く
type BqJsonSchemaElemDefault = BqJsonSchemaElemBase & {
  type: BqJsonTypes
}
type BqJsonSchemaElemRecord = BqJsonSchemaElemBase & {
  type: "RECORD",
  fields: BqJsonSchemaElem[]
}
type BqJsonSchemaElem = BqJsonSchemaElemDefault | BqJsonSchemaElemRecord
export type BqJsonSchema = BqJsonSchemaElem[]

const cast :{[key in BqJsonTypes]:(column :string)=>string} = {
  "TIMESTAMP": (column :string): string => `SAFE_CAST(SAFE.STRING(${column}) AS TIMESTAMP)`,
  "STRING": (column :string): string => `SAFE.STRING(${column})`,
  "DATE": (column :string): string => `DATE(SAFE.STRING(${column}))`,
  "INTEGER": (column :string): string => `SAFE.INT64(${column})`,
}

export const generateSelect = (schema: BqJsonSchema, prefix: string) => {
  const columns: string[] = []
    for (let elem of schema) {
    let column = ""
    let column_prefix = elem.mode === "REPEATED" ? "" : prefix
    if (elem.type === "RECORD") {
      column = `STRUCT(
${generateSelect(elem.fields, `${column_prefix}${elem.name}.`)}
)`
    } else {
      column = cast[elem.type](`${column_prefix}${elem.name}`)
    }
    if (elem.mode === "REPEATED") {
      column = `ARRAY(
SELECT
${column}
FROM UNNEST(JSON_QUERY_ARRAY(${prefix}${elem.name})) ${elem.name}
WITH OFFSET ${elem.name}_index
ORDER BY ${elem.name}_index
)`
    }
    column += ` AS ${elem.name}`
    columns.push(column)
  }
  const query = columns.join(",\n")
  // インデントを整える部分
  const lines = query.split("\n")
  const res_lines: string[] = []
  let indent_cnt = 1 // SELECT句分
  for (let i = 0; i< lines.length; ++i){
    let l = lines[i]
    const heading_close_cnt =  [...l.matchAll(/^([\)>}]|FROM|\s)+/g)].map(v=>v[0]).map(v=>[...v.matchAll(/(FROM|[\)}>])/g)]).flat().length
    indent_cnt -= heading_close_cnt
    l = "  ".repeat(Math.max(0,indent_cnt)) + l
    indent_cnt -= [...l.matchAll(/([>}\)]|FROM)/g)].length - heading_close_cnt
    indent_cnt += [...l.matchAll(/([<{\(]|SELECT)/g)].length
    res_lines.push(l)
  }
  return "SELECT\n" + res_lines.join('\n') + "\nFROM t"
}

