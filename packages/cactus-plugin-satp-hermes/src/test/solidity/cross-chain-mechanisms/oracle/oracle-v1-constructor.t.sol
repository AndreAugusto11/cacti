// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.29;

import "forge-std/Test.sol";
import "forge-std/console.sol";

import {SATPOracleV1} from "../../../../main/solidity/cross-chain-mechanisms/oracle/oracle-v1.sol";
import {SATPOracleVerifierV1} from "../../../../main/solidity/cross-chain-mechanisms/oracle/oracle-verifier-v1.sol";

contract SATPOracleV1ConstructorTest is Test {
	SATPOracleV1 public oracle;
	SATPOracleVerifierV1 public verifier;

	function setUp() public {
		oracle = new SATPOracleV1();
		verifier = new SATPOracleVerifierV1();
	}

	function testConstructor() public {
		assertEq(oracle.getVersion(), 1, "Oracle version should be 1");
		assertEq(verifier.getVersion(), 1, "Verifier version should be 1");
	}
}
