// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.29;

contract SATPOracleVerifierV1 {
	uint256 public constant SATP_ORACLE_VERSION = 1;
	
	constructor() {
		// Constructor logic can be added here if needed
	}
		// Constructor logic can be added here if needed
	function getVersion() public pure returns (uint256) {
		return SATP_ORACLE_VERSION;
	}
}
