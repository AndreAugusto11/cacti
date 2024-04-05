/**
 *
 * Please note:
 * This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * Do not edit this file manually.
 *
 */

@file:Suppress(
    "ArrayInDataClass",
    "EnumEntryName",
    "RemoveRedundantQualifierName",
    "UnusedImport"
)

package org.openapitools.client.models

import org.openapitools.client.models.CreateViewRequestNetworkDetails

import com.squareup.moshi.Json
import com.squareup.moshi.JsonClass

/**
 * Request object for createViewV1 endpoint
 *
 * @param strategyId 
 * @param networkDetails 
 * @param stateIds 
 * @param tI 
 * @param tF 
 * @param viewID 
 */


data class CreateViewRequest (

    @Json(name = "strategyId")
    val strategyId: kotlin.String,

    @Json(name = "networkDetails")
    val networkDetails: CreateViewRequestNetworkDetails,

    @Json(name = "stateIds")
    val stateIds: kotlin.collections.List<kotlin.String>? = null,

    @Json(name = "tI")
    val tI: kotlin.String? = null,

    @Json(name = "tF")
    val tF: kotlin.String? = null,

    @Json(name = "viewID")
    val viewID: kotlin.String? = null

)
