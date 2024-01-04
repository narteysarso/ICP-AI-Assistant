import { AssistantCreateParams } from "openai/resources/beta/assistants/assistants";

export const assistantModel: AssistantCreateParams = {
	name: "ICPAssistant",
	instructions: `You are a helpful assistant that works for a company called ICP Assistant called Serwaa. 
    Your tone should be friendly and helpful Keep your answers fairly detailed and accurate. 
    At the beginning of every conversation, ALWAYS mention your name, and list the capabilities and services you provide based on the tools you have. 
    Keep your responses short, polite and professional. 
    
    YOU DO NOT have any information about the current state of cryptocurrency tokens USE the appropriate tool to get current information about a blockchain / cryptocurrency token and combine with the information you already know.
    Likewise, YOU DO NOT have information of projects running on the ICP, USE tools available to find information on projects on the ICP. 
    
    When you use the get_crypto_blockchain_news tool, list ONLY TITLES from the news results, then ask if the user would like to get additional information for any of the listed news. 
    
    When you use get_info_about_cryptocurrency_token tool, responsed with an array of objects containing all of the coins that use each requested symbol. Do your best to parse as much information as possible from the response JSON string.
    
    You can use a number of tools to communicate with Internet Computer Protocol (ICP). These tools require a mnemonic phrase or seed. The first time you use any of these tools, ASK the user for a provide a 12 or 24 worded seed or mnemonic phrase or the permission to generate a random 12-worded seed phrase.
    Once the user has accepted a phrase or seed, ALWAYS remember and reuse the mnemonic phrase or seed throughout the chat. The words seed, mnemonic, and phrase are used interchangeably.`,
	model: "gpt-3.5-turbo-1106",
	tools: [
		{ "type": "code_interpreter" },
		{ "type": "retrieval" },
		{
			"type": "function",
			"function": {
				"name": "get_icp_address_by_principal",
				"description": "Use this tool to get ICP token account address.",
				"parameters": {
					"type": "object",
					"properties": {
						"principal": {
							"type": "string",
							"description": "ICP Principal"
						},
						"mnemonic_phrase": {
							"type": "string",
							"description": "Seed or mnemonic phrase to connect to ICP"
						}
					},
					"required": [
						"principal",
						"mnemonic_phrase"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "transfer_ICP_token",
				"description": "Use this tool to transfer ICP token to another account",
				"parameters": {
					"type": "object",
					"properties": {
						"to": {
							"type": "string",
							"description": "Receiving account address"
						},
						"mnemonic_phrase": {
							"type": "string",
							"description": "Seed or mnemonic phrase to connect to ICP"
						},
						"amount": {
							"type": "string",
							"description": "Number of tokens to send"
						}
					},
					"required": [
						"to",
						"mnemonic_phrase",
						"amount"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "get_icp_balance_by_address",
				"description": "Use this tool to get balance of icp address.\nThis tool returns the ICP Token balance of the provided address.",
				"parameters": {
					"type": "object",
					"properties": {
						"address": {
							"type": "string",
							"description": "Account address"
						},
						"mnemonic_phrase": {
							"type": "string",
							"description": "Seed or mnemonic phrase to connect to ICP"
						}
					},
					"required": [
						"address",
						"mnemonic_phrase"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "get_ckbtc_balance_by_principal",
				"description": "Use this tool to get CKBTC token balance for a principal.",
				"parameters": {
					"type": "object",
					"properties": {
						"principal": {
							"type": "string",
							"description": "ICP identity principal"
						},
						"mnemonic_phrase": {
							"type": "string",
							"description": "Seed or mnemonic phrase to connect to ICP"
						}
					},
					"required": [
						"principal",
						"mnemonic_phrase"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "update_ckbtc_balance",
				"description": "Use this tool to execute a balance update on ICP.\nONLY USE THIS TOOL WHEN THE USER EXPLICITLY CALLS FOR IT.",
				"parameters": {
					"type": "object",
					"properties": {
						"mnemonic_phrase": {
							"type": "string",
							"description": "Seed or mnemonic phrase to connect to ICP"
						}
					},
					"required": [
						"mnemonic_phrase"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "transfer_CKBTC_TOKEN",
				"description": "Use this tool to transfer CKBTC token to a recipient",
				"parameters": {
					"type": "object",
					"properties": {
						"recipient_principal": {
							"type": "string",
							"description": "ICP identity principal of recipient"
						},
						"mnemonic_phrase": {
							"type": "string"
						},
						"amount": {
							"type": "string",
							"description": "Number of CKBTC tokens to transfer"
						}
					},
					"required": [
						"recipient_principal",
						"mnemonic_phrase",
						"amount"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "convert_from_base_to_destination_currency",
				"description": "Use this tool to convert on FIAT and crypto currency to another currency.\nGet Currency Exchange by specifying the quotes of source (from) and destination (to)",
				"parameters": {
					"type": "object",
					"properties": {
						"from": {
							"type": "string",
							"description": "base or quote currency"
						},
						"to": {
							"type": "string",
							"description": "destination currency"
						},
						"amount": {
							"type": "number",
							"description": "amount of quote currency to convert"
						}
					},
					"required": [
						"from",
						"to",
						"amount"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "get_crypto_blockchain_news",
				"description": "Use this tool to get a list of cryptocurrency and blockchain news for a topic",
				"parameters": {
					"type": "object",
					"properties": {},
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "get_ckbtc_address_by_principal",
				"description": "Use this tool to get CKBTC token address for a principal.",
				"parameters": {
					"type": "object",
					"properties": {
						"principal": {
							"type": "string",
							"description": "ICP identity Principal"
						},
						"mnemonic_phrase": {
							"type": "string",
							"description": "Seed or mnemonic phrase to connect to ICP"
						}
					},
					"required": [
						"principal",
						"mnemonic_phrase"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "get_currency_list",
				"description": "Use this tool to get a list of all FIAT and Crypto currencies",
				"parameters": {
					"type": "object",
					"properties": {},
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "get_list_of_latest_tokens",
				"description": "Use this tool to list of all active cryptocurrencies with latest market data.\nThis tool gets list of tokens and their quotes and prices, name, symbol, total supply, total circulation, max supply, if infinity supply, tags and platforms you can purchase the tokens across multiple blockchains.",
				"parameters": {
					"type": "object",
					"properties": {
						"limit": {
							"type": "string",
							"description": "number of results to return"
						}
					},
					"required": [
						"limit"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "search",
				"description": "a search engine. useful for when you need to answer questions about current events. input should be a search query.",
				"parameters": {
					"type": "object",
					"properties": {
						"input": {
							"type": "string"
						}
					},
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "get_random_phrase",
				"description": "Use this tool to generate random mnemonic phrase or seed.",
				"parameters": {
					"type": "object",
					"properties": {},
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "get_ICP_identity",
				"description": "Use this tool to get or generate an Identity for communicating on Internet Computer Protocol (ICP).\nThe output is a JSON with properties seed , identity, and principal. The principal property can be shared. The seed property most be kept private and not shared. DO NOT show identity property in output. Used identity property to generate an ICP http agent.",
				"parameters": {
					"type": "object",
					"properties": {
						"mnemonic_phrase": {
							"type": "string",
							"description": "Seed or mnemonic phrase to use to generate ICP identity"
						}
					},
					"required": [
						"mnemonic_phrase"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		},
		{
			"type": "function", "function": {
				"name": "get_info_about_cryptocurrency_token",
				"description": "Use this tool to get information about a cryptocurrency token. \n",
				"parameters": {
					"type": "object",
					"properties": {
						"slug": {
							"type": "string",
							"description": "Name of cryptocurrency. You can pass a comma-separated list of cryptocurrency slugs. Example: \"bitcoin,ethereum\""
						},
						"symbol": {
							"type": "string",
							"description": "Symbol(s) of cryptocurrency. You can pass one or more comma-separated cryptocurrency symbols to the symbol property. Example: \"BTC,ETH\"."
						}
					},
					"required": [
						"slug",
						"symbol"
					],
					"additionalProperties": false,
					"$schema": "http://json-schema.org/draft-07/schema#"
				}
			}
		}
	],
}