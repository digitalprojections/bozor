import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:25
 * @route '/listings/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/listings/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:25
 * @route '/listings/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:25
 * @route '/listings/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:25
 * @route '/listings/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:25
 * @route '/listings/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:25
 * @route '/listings/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingController::create
 * @see app/Http/Controllers/ListingController.php:25
 * @route '/listings/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:37
 * @route '/listings'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/listings',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:37
 * @route '/listings'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:37
 * @route '/listings'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:37
 * @route '/listings'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingController::store
 * @see app/Http/Controllers/ListingController.php:37
 * @route '/listings'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
 * @see routes/web.php:50
 * @route '/listings'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/listings',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:50
 * @route '/listings'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:50
 * @route '/listings'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:50
 * @route '/listings'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:50
 * @route '/listings'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:50
 * @route '/listings'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:50
 * @route '/listings'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:111
 * @route '/listings/{listing}/edit'
 */
export const edit = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/listings/{listing}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:111
 * @route '/listings/{listing}/edit'
 */
edit.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:111
 * @route '/listings/{listing}/edit'
 */
edit.get = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:111
 * @route '/listings/{listing}/edit'
 */
edit.head = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:111
 * @route '/listings/{listing}/edit'
 */
    const editForm = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:111
 * @route '/listings/{listing}/edit'
 */
        editForm.get = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingController::edit
 * @see app/Http/Controllers/ListingController.php:111
 * @route '/listings/{listing}/edit'
 */
        editForm.head = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\ListingController::update
 * @see app/Http/Controllers/ListingController.php:129
 * @route '/listings/{listing}'
 */
export const update = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/listings/{listing}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ListingController::update
 * @see app/Http/Controllers/ListingController.php:129
 * @route '/listings/{listing}'
 */
update.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::update
 * @see app/Http/Controllers/ListingController.php:129
 * @route '/listings/{listing}'
 */
update.patch = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ListingController::update
 * @see app/Http/Controllers/ListingController.php:129
 * @route '/listings/{listing}'
 */
    const updateForm = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingController::update
 * @see app/Http/Controllers/ListingController.php:129
 * @route '/listings/{listing}'
 */
        updateForm.patch = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ListingController::destroy
 * @see app/Http/Controllers/ListingController.php:186
 * @route '/listings/{listing}'
 */
export const destroy = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/listings/{listing}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ListingController::destroy
 * @see app/Http/Controllers/ListingController.php:186
 * @route '/listings/{listing}'
 */
destroy.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::destroy
 * @see app/Http/Controllers/ListingController.php:186
 * @route '/listings/{listing}'
 */
destroy.delete = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ListingController::destroy
 * @see app/Http/Controllers/ListingController.php:186
 * @route '/listings/{listing}'
 */
    const destroyForm = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ListingController::destroy
 * @see app/Http/Controllers/ListingController.php:186
 * @route '/listings/{listing}'
 */
        destroyForm.delete = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\BidController::bid
 * @see app/Http/Controllers/BidController.php:14
 * @route '/listings/{listing}/bid'
 */
export const bid = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bid.url(args, options),
    method: 'post',
})

bid.definition = {
    methods: ["post"],
    url: '/listings/{listing}/bid',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BidController::bid
 * @see app/Http/Controllers/BidController.php:14
 * @route '/listings/{listing}/bid'
 */
bid.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return bid.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BidController::bid
 * @see app/Http/Controllers/BidController.php:14
 * @route '/listings/{listing}/bid'
 */
bid.post = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bid.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BidController::bid
 * @see app/Http/Controllers/BidController.php:14
 * @route '/listings/{listing}/bid'
 */
    const bidForm = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bid.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BidController::bid
 * @see app/Http/Controllers/BidController.php:14
 * @route '/listings/{listing}/bid'
 */
        bidForm.post = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bid.url(args, options),
            method: 'post',
        })
    
    bid.form = bidForm
/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
export const buyNow = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buyNow.url(args, options),
    method: 'get',
})

buyNow.definition = {
    methods: ["get","head"],
    url: '/listings/{listing}/buy-now',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
buyNow.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return buyNow.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
buyNow.get = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buyNow.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
buyNow.head = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buyNow.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
    const buyNowForm = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buyNow.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
        buyNowForm.get = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buyNow.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
        buyNowForm.head = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buyNow.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buyNow.form = buyNowForm
/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
export const buyNow = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buyNow.url(args, options),
    method: 'post',
})

buyNow.definition = {
    methods: ["post"],
    url: '/listings/{listing}/buy-now',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
buyNow.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return buyNow.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
buyNow.post = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: buyNow.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
    const buyNowForm = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: buyNow.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TransactionController::buyNow
 * @see app/Http/Controllers/TransactionController.php:14
 * @route '/listings/{listing}/buy-now'
 */
        buyNowForm.post = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: buyNow.url(args, options),
            method: 'post',
        })
    
    buyNow.form = buyNowForm
/**
* @see \App\Http\Controllers\ListingController::show
 * @see app/Http/Controllers/ListingController.php:90
 * @route '/listings/{listing}'
 */
export const show = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/listings/{listing}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ListingController::show
 * @see app/Http/Controllers/ListingController.php:90
 * @route '/listings/{listing}'
 */
show.url = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{listing}', parsedArgs.listing.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ListingController::show
 * @see app/Http/Controllers/ListingController.php:90
 * @route '/listings/{listing}'
 */
show.get = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ListingController::show
 * @see app/Http/Controllers/ListingController.php:90
 * @route '/listings/{listing}'
 */
show.head = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ListingController::show
 * @see app/Http/Controllers/ListingController.php:90
 * @route '/listings/{listing}'
 */
    const showForm = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ListingController::show
 * @see app/Http/Controllers/ListingController.php:90
 * @route '/listings/{listing}'
 */
        showForm.get = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ListingController::show
 * @see app/Http/Controllers/ListingController.php:90
 * @route '/listings/{listing}'
 */
        showForm.head = (args: { listing: number | { id: number } } | [listing: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const listings = {
    create: Object.assign(create, create),
store: Object.assign(store, store),
index: Object.assign(index, index),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
bid: Object.assign(bid, bid),
buyNow: Object.assign(buyNow, buyNow),
show: Object.assign(show, show),
}

export default listings