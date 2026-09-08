"use client";

import styled, { css } from "styled-components";

const base = css`
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-height: 44px;
  min-width: 44px;
  font-family: var(--font-pricedown), Impact, sans-serif;
  font-size: clamp(1.05rem, 1.4vw, 1.35rem);
  letter-spacing: 0.06em;
  padding: 0.7rem 1.8rem 0.55rem;
  text-transform: lowercase;
  cursor: pointer;
  text-decoration: none;
  transition:
    transform var(--transition-fast),
    box-shadow var(--transition-fast),
    background var(--transition-fast),
    color var(--transition-fast);
  user-select: none;

  &:focus-visible {
    outline: 2px solid var(--focus-color);
    outline-offset: 3px;
  }

  &:active {
    transform: translate(3px, 3px);
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.6);
  }
`;

export const GtaButton = styled.a<{ $variant?: "money" | "blood" | "sand" }>`
  ${base}
  ${({ $variant = "money" }) => {
    switch ($variant) {
      case "money":
        return css`
          background: var(--color-money);
          color: #07120a;
          box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.6);
          &:hover {
            background: #6fdc60;
            transform: translate(-2px, -2px) scale(1.02);
            box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.6);
            filter: brightness(1.06);
          }
        `;
      case "blood":
        return css`
          background: var(--color-blood);
          color: #fde8d8;
          box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.6);
          &:hover {
            background: #d63a3f;
            transform: translate(-2px, -2px) scale(1.02);
            box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.6);
            filter: brightness(1.06);
          }
        `;
      case "sand":
        return css`
          background: transparent;
          color: var(--color-sand);
          border: 2px solid var(--color-sand);
          box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.6);
          &:hover {
            background: var(--color-sand);
            color: var(--color-night);
            transform: translate(-2px, -2px) scale(1.02);
            box-shadow: 8px 8px 0 rgba(0, 0, 0, 0.6);
            filter: brightness(1.04);
          }
        `;
      default: {
        const exhaustive: never = $variant;
        return exhaustive;
      }
    }
  }}
`;
