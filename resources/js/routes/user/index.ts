import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
 * @see routes/web.php:26
 * @route '/user/accept-terms'
 */
export const acceptTerms = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acceptTerms.url(options),
    method: 'post',
})

acceptTerms.definition = {
    methods: ["post"],
    url: '/user/accept-terms',
} satisfies RouteDefinition<["post"]>

/**
 * @see routes/web.php:26
 * @route '/user/accept-terms'
 */
acceptTerms.url = (options?: RouteQueryOptions) => {
    return acceptTerms.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:26
 * @route '/user/accept-terms'
 */
acceptTerms.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: acceptTerms.url(options),
    method: 'post',
})
const user = {
    acceptTerms: Object.assign(acceptTerms, acceptTerms),
}

export default user