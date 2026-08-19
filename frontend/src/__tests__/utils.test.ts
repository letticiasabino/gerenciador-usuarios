import { describe, it, expect } from "vitest";
import {
  formatPhone,
  formatZipCode,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  getInitials,
} from "../utils";

describe("Utils", () => {
  describe("formatPhone", () => {
    it("deve formatar telefone celular (11 dígitos)", () => {
      expect(formatPhone("11999999999")).toBe("(11) 99999-9999");
    });

    it("deve formatar telefone fixo (10 dígitos)", () => {
      expect(formatPhone("1133334444")).toBe("(11) 3333-4444");
    });
  });

  describe("formatZipCode", () => {
    it("deve formatar CEP corretamente", () => {
      expect(formatZipCode("01234567")).toBe("01234-567");
    });
  });

  describe("formatDate", () => {
    it("deve formatar data no padrão brasileiro DD/MM/AAAA", () => {
      const result = formatDate("2026-08-15");
      expect(result).toBe("15/08/2026");
    });
  });

  describe("formatDateTime", () => {
    it("deve formatar data e hora corretamente", () => {
      const result = formatDateTime("2026-08-15T14:30:00Z");
      expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  describe("formatRelativeTime", () => {
    it("deve retornar 'agora mesmo' para datas recentes", () => {
      const result = formatRelativeTime(new Date().toISOString());
      expect(result).toBe("agora mesmo");
    });

    it("deve retornar tempo em minutos para minutos atrás", () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      expect(formatRelativeTime(fiveMinAgo)).toBe("há 5 min");
    });

    it("deve retornar tempo em horas para horas atrás", () => {
      const twoHoursAgo = new Date(
        Date.now() - 2 * 60 * 60 * 1000,
      ).toISOString();
      expect(formatRelativeTime(twoHoursAgo)).toBe("há 2 horas");
    });

    it("deve retornar tempo em dias para dias atrás", () => {
      const threeDaysAgo = new Date(
        Date.now() - 3 * 24 * 60 * 60 * 1000,
      ).toISOString();
      expect(formatRelativeTime(threeDaysAgo)).toBe("há 3 dias");
    });
  });

  describe("getInitials", () => {
    it("deve retornar iniciais corretamente para nome composto", () => {
      expect(getInitials("Ana Maria Silva")).toBe("AS");
    });

    it("deve retornar primeira letra para nome único", () => {
      expect(getInitials("Ana")).toBe("A");
    });
  });
});
