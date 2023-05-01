export function defer(do_later: () => void, do_now: () => void) {
    do_now()
    do_later()
}
