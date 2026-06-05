import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ListingMessageController::answer
 * @see app/Http/Controllers/ListingMessageController.php:60
 * @route '/listing-messages/{message}/answer'
 */
export const answer = (args: { message: string | number | { id: string | number } } | [message: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: answer.url(args, options),
    method: 'patch',
})

answer.definition = {
    methods: ["patch"],
    url: '/listing-messages/{message}/answer',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ListingMessageController::answer
 * @see app/Http/Controllers/ListingMessageController.php:60
 * @route '/listing-messages/{message}/answer'
 */
answer.url = (args: { message: string | number | { id: string | number } } | [message: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { message: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { message: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    message: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        message: typeof args.message === 'object'
                ? args.message.id
                : args.message,
                }

    return answer.definition.url
            .replace('{message}', parsedArgs.message.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingMessageController::answer
 * @see app/Http/Controllers/ListingMessageController.php:60
 * @route '/listing-messages/{message}/answer'
 */
answer.patch = (args: { message: string | number | { id: string | number } } | [message: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: answer.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ListingMessageController::answer
 * @see app/Http/Controllers/ListingMessageController.php:60
 * @route '/listing-messages/{message}/answer'
 */
    const answerForm = (args: { message: string | number | { id: string | number } } | [message: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: answer.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingMessageController::answer
 * @see app/Http/Controllers/ListingMessageController.php:60
 * @route '/listing-messages/{message}/answer'
 */
        answerForm.patch = (args: { message: string | number | { id: string | number } } | [message: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: answer.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    answer.form = answerForm
const listingMessages = {
    answer: Object.assign(answer, answer),
}

export default listingMessages