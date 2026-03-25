# Averom — AI Supplier Intelligence Platform

Built for Amazon FBA sellers and B2B operators who need to verify suppliers before placing purchase orders.

## Problem

Counterfeit suppliers and sourcing fraud cost importers millions every year. Manual vetting is slow, expensive, and unreliable.

## Solution

Averom uses Claude AI to autonomously research suppliers, score risk across 7 weighted categories, and generate structured intelligence reports in seconds.

## Features

- AI Supplier Verification Agent
- Deal Profitability Analyzer
- Sourcing Engine with AI-powered matching
- Multi-turn AI Copilot with live data context
- Communication Hub for context-aware outreach
- Deal Pipeline with RAG-grounded responses

## Tech Stack

- Frontend: Next.js, TypeScript
- Backend: Vercel Serverless Functions
- Database: Supabase (PostgreSQL + pgvector)
- AI: Claude API (Anthropic) with web search tool
- Payments: Stripe
- Deployment: Vercel

## Architecture

User Input → Next.js Frontend → Vercel API Route → Claude API (with Supabase context injected) → Structured Output → Supabase Storage → Dashboard

## Live Demo

- Platform: https://averom-v2.vercel.app
- Supplier Verification: https://averom.co

## Why This Is Not Just an AI Wrapper

Averom is not a thin wrapper around a language model. The system includes:

- Deterministic risk scoring across 7 weighted supplier categories before any AI call
- Structured prompt engineering that injects live Supabase context (past reports, deal history) into each Claude request
- pgvector semantic search for RAG-grounded supplier matching, not keyword lookup
- Agentic web research using Claude's web search tool to pull real-time supplier signals
- Persistent deal state stored and retrieved across sessions, not re-generated each time

The AI layer handles reasoning and synthesis. The deterministic layer handles scoring, routing, and data retrieval. Both are required for the system to function.

## Execution Speed (built in 1 week, 30+ reports, 15 waitlist)

- Built from zero to deployed platform in under 1 week
- 30+ supplier intelligence reports generated in production
- 15 businesses on the waitlist before public launch
- 8 agentic modules shipped: verification, deal analysis, sourcing, copilot, outreach, pipeline, comparison, and risk scoring
