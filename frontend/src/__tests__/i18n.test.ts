import { describe, it, expect } from "vitest";
import i18n from "../i18n";

describe("Internacionalização (i18n)", () => {
  it("deve carregar com o idioma padrão ou salvo", () => {
    expect(["pt-BR", "en-US", "es"]).toContain(i18n.language);
  });

  it("deve traduzir chaves corretamente em pt-BR", async () => {
    await i18n.changeLanguage("pt-BR");
    expect(i18n.t("nav.users")).toBe("Usuários");
    expect(i18n.t("dashboard.title")).toBe("Gerenciador de Usuários");
    expect(i18n.t("common.save")).toBe("Salvar Dados");
  });

  it("deve alternar para en-US e traduzir chaves", async () => {
    await i18n.changeLanguage("en-US");
    expect(i18n.t("nav.users")).toBe("Users");
    expect(i18n.t("dashboard.title")).toBe("User Management");
    expect(i18n.t("common.save")).toBe("Save Changes");
  });

  it("deve alternar para es e traduzir chaves", async () => {
    await i18n.changeLanguage("es");
    expect(i18n.t("nav.users")).toBe("Usuarios");
    expect(i18n.t("dashboard.title")).toBe("Gestión de Usuarios");
    expect(i18n.t("common.save")).toBe("Guardar Datos");
  });

  it("deve retornar a chave em caso de inexistência com fallback", async () => {
    await i18n.changeLanguage("pt-BR");
    expect(i18n.t("nav.calendar")).toBe("Calendário");
  });
});
