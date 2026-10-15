# Fail-closed contract

## Required invariants

- Accept only explicitly approved, abstract source classes.
- Reject an unknown source class before any collection path is entered.
- Treat missing evidence as `unknown`; never infer absence from lack of visibility.
- Emit only an approved aggregate status vocabulary.
- Stop before output if an allowlist, isolation proof, or teardown proof is missing.

## Explicit non-capabilities

- No command execution or retry.
- No provider token issuance.
- No secret, instance-metadata, product, database, user-data, or raw-record access.
- No external network transfer or durable raw logging.

All operational identifiers and exact policy bindings remain outside this public repository.
