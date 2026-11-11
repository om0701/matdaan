package model;

/**
 * Represents a registered political party or option on the official ballot.
 */
public class Candidate {
    private final String code;         // e.g. BJP, INC, AAP, NOTA
    private final String fullName;     // Full recognized political party name
    private final String symbolDesc;   // Registered symbol description (Lotus, Hand, Broom, etc.)
    private final String themeColor;   // Left-border branding color

    public Candidate(String code, String fullName, String symbolDesc, String themeColor) {
        this.code = code;
        this.fullName = fullName;
        this.symbolDesc = symbolDesc;
        this.themeColor = themeColor;
    }

    public String getCode() {
        return code;
    }

    public String getFullName() {
        return fullName;
    }

    public String getSymbolDesc() {
        return symbolDesc;
    }

    public String themeColor() {
        return themeColor;
    }
}

