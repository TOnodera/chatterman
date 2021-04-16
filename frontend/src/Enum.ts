
const APPLY_REACTIONS = {
  APPROVE: 1,
  DENY: 2
} as const
type APPLY_REACTIONS = typeof APPLY_REACTIONS[keyof typeof APPLY_REACTIONS];

export {
  APPLY_REACTIONS
}
