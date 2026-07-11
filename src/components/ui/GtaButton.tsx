"use client";

import styled, { css } from "styled-components";

const base = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-pricedown), Impact, sans-serif;
  font-size: clamp(1.05rem, 1.4vw, 1.35rem);
  letter-spacing: 0.06em;
  padding: 0.7rem 1.8rem 0.55rem;
  text-transform: lowercase;
  cursor: pointer;
  text-decoration: none;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease,
    background 0.15s ease,
    color 0.15s ease;
  user-select: none;

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
          background: #54b948;
          color: #07120a;
          box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.6);
          &:hover {
            background: #6fdc60;
            transform: translate(-1px, -1px);
            box-shadow: 7px 7px 0 rgba(0, 0, 0, 0.6);
          }
        `;
      case "blood":
        return css`
          background: #b3262a;
          color: #fde8d8;
          box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.6);
          &:hover {
            background: #d63a3f;
            transform: translate(-1px, -1px);
            box-shadow: 7px 7px 0 rgba(0, 0, 0, 0.6);
          }
        `;
      case "sand":
        return css`
          background: transparent;
          color: #e8d5a0;
          border: 2px solid #e8d5a0;
          box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.6);
          &:hover {
            background: #e8d5a0;
            color: #0c0913;
            transform: translate(-1px, -1px);
            box-shadow: 7px 7px 0 rgba(0, 0, 0, 0.6);
          }
        `;
      default: {
        const exhaustive: never = $variant;
        return exhaustive;
      }
    }
  }}
`;
