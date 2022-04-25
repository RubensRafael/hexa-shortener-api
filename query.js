export const INSERT_URL = "INSERT INTO links (origin,short)VALUES ($1, $2)RETURNING short"
export const GET_SHORT_CODE = "SELECT short FROM links WHERE origin=$1"
export const GET_ORIGIN = "SELECT origin FROM links WHERE short=$1"