# Simulated Runs (Historical / Reference Only)

⚠️ **DO NOT USE THESE FILES FOR PRODUCTION**

This folder contains the **original non-numbered versions** of the Playground scripts from the initial POC development (February 1-2, 2026).

## Why These Files Exist

These are the **first iteration** of the Hedera Hydropower MRV scripts before they were:
- Reorganized into numbered workflow (01_, 02_, 03_)
- Enhanced with better comments and error handling  
- Moved to `code/playground/` folder

## Current Production Scripts (USE THESE)

✅ **Use these files instead:**
- `code/playground/01_deploy_did.js` - Deploy Gateway DID
- `code/playground/02_gateway_sign.js` - Sign sensor readings
- `code/playground/03_orchestrator_verify.js` - Verify + mint NFT

## Files in This Folder

- `deploy_playground.js` - Original DID deployment (replaced by 01_deploy_did.js)
- `gateway_playground.js` - Original gateway signing (replaced by 02_gateway_sign.js)
- `orchestrator_playground.js` - Original verification (replaced by 03_orchestrator_verify.js)

## Technical Differences

Both versions have:
- ✅ Same core functionality
- ✅ Grandfather key implementation
- ✅ Ed25519 cryptographic signing
- ✅ HCS audit trail

Numbered versions (in `playground/` folder) have:
- ✅ Better code organization
- ✅ Clearer step-by-step workflow (1→2→3)
- ✅ Enhanced documentation
- ✅ More detailed console output
- ✅ Production-ready error messages

## When to Use These Files

**NEVER for production deployment.**

Only useful for:
- Historical reference
- Understanding POC evolution
- Academic research on methodology development

---

**Last Updated:** February 6, 2026  
**Status:** Archived / Reference Only
