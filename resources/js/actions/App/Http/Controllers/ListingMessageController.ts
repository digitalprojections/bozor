import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ListingMessageController::storeForListing
 * @see app/Http/Controllers/ListingMessageController.php:14
 * @route '/listings/{listing}/messages'
 */
export const storeForListing = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeForListing.url(args, options),
    method: 'post',
})

storeForListing.definition = {
    methods: ["post"],
    url: '/listings/{listing}/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ListingMessageController::storeForListing
 * @see app/Http/Controllers/ListingMessageController.php:14
 * @route '/listings/{listing}/messages'
 */
storeForListing.url = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { listing: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { listing: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    listing: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        listing: typeof args.listing === 'object'
                ? args.listing.id
                : args.listing,
                }

    return storeForListing.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingMessageController::storeForListing
 * @see app/Http/Controllers/ListingMessageController.php:14
 * @route '/listings/{listing}/messages'
 */
storeForListing.post = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeForListing.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingMessageController::storeForListing
 * @see app/Http/Controllers/ListingMessageController.php:14
 * @route '/listings/{listing}/messages'
 */
    const storeForListingForm = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeForListing.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingMessageController::storeForListing
 * @see app/Http/Controllers/ListingMessageController.php:14
 * @route '/listings/{listing}/messages'
 */
        storeForListingForm.post = (args: { listing: string | number | { id: string | number } } | [listing: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeForListing.url(args, options),
            method: 'post',
        })
    
    storeForListing.form = storeForListingForm
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
/**
* @see \App\Http\Controllers\ListingMessageController::storeForTransaction
 * @see app/Http/Controllers/ListingMessageController.php:34
 * @route '/transactions/{transaction}/messages'
 */
export const storeForTransaction = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeForTransaction.url(args, options),
    method: 'post',
})

storeForTransaction.definition = {
    methods: ["post"],
    url: '/transactions/{transaction}/messages',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ListingMessageController::storeForTransaction
 * @see app/Http/Controllers/ListingMessageController.php:34
 * @route '/transactions/{transaction}/messages'
 */
storeForTransaction.url = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transaction: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transaction: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transaction: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transaction: typeof args.transaction === 'object'
                ? args.transaction.id
                : args.transaction,
                }

    return storeForTransaction.definition.url
            .replace('{transaction}', parsedArgs.transaction.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingMessageController::storeForTransaction
 * @see app/Http/Controllers/ListingMessageController.php:34
 * @route '/transactions/{transaction}/messages'
 */
storeForTransaction.post = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeForTransaction.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingMessageController::storeForTransaction
 * @see app/Http/Controllers/ListingMessageController.php:34
 * @route '/transactions/{transaction}/messages'
 */
    const storeForTransactionForm = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeForTransaction.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingMessageController::storeForTransaction
 * @see app/Http/Controllers/ListingMessageController.php:34
 * @route '/transactions/{transaction}/messages'
 */
        storeForTransactionForm.post = (args: { transaction: string | number | { id: string | number } } | [transaction: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeForTransaction.url(args, options),
            method: 'post',
        })
    
    storeForTransaction.form = storeForTransactionForm
const ListingMessageController = { storeForListing, answer, storeForTransaction }

export default ListingMessageController