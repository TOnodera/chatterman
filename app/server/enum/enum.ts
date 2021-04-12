
const PolymorphicTables = {
    requests: 'requests'
} as const;
type PolymorphicTables = typeof PolymorphicTables[keyof typeof PolymorphicTables];

const APPLY_SENDER_NOTICE = {
    IS_NOTIFIED_YET: 1, //未送信
    IS_NOTIFIED_DONE: 2 //送信済
} as const;
type APPLY_SENDER_NOTICE = typeof APPLY_SENDER_NOTICE[keyof typeof APPLY_SENDER_NOTICE];

const APPLY_REACTION = {
    IS_ACCEPT_UNTREATED: 0, //未処理
    IS_ACCEPT_ARROW: 1, //OK
    IS_ACCEPT_DENY: 2 //NO
} as const;
type APPLY_REACTION = typeof APPLY_REACTION[keyof typeof APPLY_REACTION];

export {
    PolymorphicTables,
    APPLY_SENDER_NOTICE,
    APPLY_REACTION
}