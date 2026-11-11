import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * ============================================================================
 * MATDAAN E-VOTING SYSTEM — JAVA ENTERPRISE HTTP BACKEND SERVER
 * ============================================================================
 * Project: Indian National E-Voting Simulation Portal
 * Tech Stack: Java Standard Edition (com.sun.net.httpserver)
 * Dependencies: None (Pure Java Standard Library)
 *
 * HOW TO RUN:
 * 1. Open Terminal / Command Prompt in this folder.
 * 2. Compile: javac MatdaanServer.java
 * 3. Run:     java MatdaanServer
 *    (Or on Java 11+: java MatdaanServer.java)
 * 4. Open in browser: http://localhost:8080/
 * ============================================================================
 */
public class MatdaanServer {

    private static final int PORT = 8080;
    private static final ElectionService electionService = new ElectionService();

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        // Static Web Resource Handlers
        server.createContext("/", new StaticFileHandler());

        // REST API Endpoints
        server.createContext("/api/metrics", new MetricsHandler());
        server.createContext("/api/register", new RegisterHandler());
        server.createContext("/api/login", new LoginHandler());
        server.createContext("/api/vote", new VoteHandler());
        server.createContext("/api/admin/tally", new AdminTallyHandler());
        server.createContext("/api/admin/sample", new AdminSampleHandler());
        server.createContext("/api/admin/reset", new AdminResetHandler());

        server.setExecutor(null); // Default single/multi-thread executor
        System.out.println("=======================================================");
        System.out.println("  MATDAAN — JAVA E-VOTING SYSTEM SERVER STARTED");
        System.out.println("=======================================================");
        System.out.println("  Server URL:     http://localhost:" + PORT + "/");
        System.out.println("  Admin Username: admin");
        System.out.println("  Admin Password: admin123");
        System.out.println("  Status:         Awaiting connections (Press Ctrl+C to stop)");
        System.out.println("=======================================================\n");

        server.start();
    }

    // ========================================================================
    // STATIC FILE HANDLER (Serves index.html, style.css, app.js)
    // ========================================================================
    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String path = exchange.getRequestURI().getPath();
            if (path.equals("/") || path.isEmpty()) {
                path = "/index.html";
            }

            Path filePath = Paths.get("." + path).normalize();
            File file = filePath.toFile();

            if (!file.exists() || file.isDirectory()) {
                sendResponse(exchange, 404, "text/plain", "404 Not Found");
                return;
            }

            String contentType = "text/html; charset=UTF-8";
            if (path.endsWith(".css")) {
                contentType = "text/css; charset=UTF-8";
            } else if (path.endsWith(".js")) {
                contentType = "application/javascript; charset=UTF-8";
            } else if (path.endsWith(".json")) {
                contentType = "application/json; charset=UTF-8";
            }

            byte[] bytes = Files.readAllBytes(filePath);
            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }
    }

    // ========================================================================
    // REST API HANDLERS
    // ========================================================================

    // GET /api/metrics - Public participation counters
    static class MetricsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "application/json", "{\"error\":\"Method Not Allowed\"}");
                return;
            }

            int registered = electionService.getRegisteredCount();
            int votes = electionService.getTotalVotesCount();
            double turnout = registered > 0 ? (votes * 100.0 / registered) : 0.0;

            String json = String.format(Locale.US,
                "{\"registered\":%d,\"votes\":%d,\"turnout\":%.1f}",
                registered, votes, turnout);

            sendResponse(exchange, 200, "application/json", json);
        }
    }

    // POST /api/register - Elector registration (Age >= 18 check)
    static class RegisterHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "application/json", "{\"error\":\"Method Not Allowed\"}");
                return;
            }

            String body = readRequestBody(exchange);
            Map<String, String> data = parseJson(body);

            String name = data.get("name");
            String ageStr = data.get("age");
            String state = data.get("state");
            String pin = data.get("pin");

            if (name == null || ageStr == null || state == null || pin == null) {
                sendResponse(exchange, 400, "application/json", "{\"error\":\"Missing required fields\"}");
                return;
            }

            int age;
            try {
                age = Integer.parseInt(ageStr.trim());
            } catch (NumberFormatException e) {
                sendResponse(exchange, 400, "application/json", "{\"error\":\"Invalid age format\"}");
                return;
            }

            // Representation of the People Act, 1950 & Article 326
            if (age < 18) {
                sendResponse(exchange, 400, "application/json",
                    "{\"error\":\"Registration declined: You must be at least 18 years of age to register.\"}");
                return;
            }

            if (!pin.matches("^\\d{4}$")) {
                sendResponse(exchange, 400, "application/json",
                    "{\"error\":\"PIN must be exactly 4 numeric digits.\"}");
                return;
            }

            Elector elector = electionService.registerElector(name, age, state, pin);
            String json = String.format(Locale.US,
                "{\"success\":true,\"voterId\":\"%s\",\"name\":\"%s\",\"age\":%d,\"state\":\"%s\"}",
                elector.getId(), escape(elector.getName()), elector.getAge(), escape(elector.getState()));

            sendResponse(exchange, 200, "application/json", json);
        }
    }

    // POST /api/login - Voter login
    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "application/json", "{\"error\":\"Method Not Allowed\"}");
                return;
            }

            String body = readRequestBody(exchange);
            Map<String, String> data = parseJson(body);
            String voterId = data.get("voterId");
            String pin = data.get("pin");

            Elector elector = electionService.findElector(voterId);
            if (elector == null) {
                sendResponse(exchange, 401, "application/json", "{\"error\":\"Voter ID not found in electoral roll.\"}");
                return;
            }

            if (!elector.getPin().equals(pin)) {
                sendResponse(exchange, 401, "application/json", "{\"error\":\"Incorrect 4-digit PIN.\"}");
                return;
            }

            String json = String.format(Locale.US,
                "{\"success\":true,\"voterId\":\"%s\",\"name\":\"%s\",\"hasVoted\":%b,\"state\":\"%s\",\"age\":%d}",
                elector.getId(), escape(elector.getName()), elector.hasVoted(), escape(elector.getState()), elector.getAge());

            sendResponse(exchange, 200, "application/json", json);
        }
    }

    // POST /api/vote - Cast vote (One vote per elector enforced)
    static class VoteHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                sendResponse(exchange, 405, "application/json", "{\"error\":\"Method Not Allowed\"}");
                return;
            }

            String body = readRequestBody(exchange);
            Map<String, String> data = parseJson(body);
            String voterId = data.get("voterId");
            String partyCode = data.get("partyCode");

            boolean success = electionService.castVote(voterId, partyCode);
            if (!success) {
                sendResponse(exchange, 400, "application/json",
                    "{\"error\":\"You have already voted or voter ID is invalid.\"}");
                return;
            }

            String json = String.format(Locale.US,
                "{\"success\":true,\"message\":\"Ballot securely recorded.\",\"timestamp\":\"%s\"}",
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")));

            sendResponse(exchange, 200, "application/json", json);
        }
    }

    // GET /api/admin/tally - Confidential Admin Tally & Electoral Roll
    static class AdminTallyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Protected Admin Check
            String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
            if (authHeader == null || !authHeader.contains("admin123")) {
                sendResponse(exchange, 403, "application/json",
                    "{\"error\":\"Access Denied: Officer authentication required.\"}");
                return;
            }

            Map<String, Integer> tally = electionService.getVoteTally();
            StringBuilder tallyJson = new StringBuilder("{");
            int count = 0;
            for (Map.Entry<String, Integer> e : tally.entrySet()) {
                if (count++ > 0) tallyJson.append(",");
                tallyJson.append("\"").append(e.getKey()).append("\":").append(e.getValue());
            }
            tallyJson.append("}");

            int registered = electionService.getRegisteredCount();
            int votes = electionService.getTotalVotesCount();
            double turnout = registered > 0 ? (votes * 100.0 / registered) : 0.0;

            String json = String.format(Locale.US,
                "{\"registered\":%d,\"votes\":%d,\"turnout\":%.1f,\"tally\":%s}",
                registered, votes, turnout, tallyJson.toString());

            sendResponse(exchange, 200, "application/json", json);
        }
    }

    // POST /api/admin/sample - Load 14 sample votes
    static class AdminSampleHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            electionService.loadSampleVotes();
            sendResponse(exchange, 200, "application/json",
                "{\"success\":true,\"message\":\"14 sample votes injected successfully.\"}");
        }
    }

    // POST /api/admin/reset - Reset election data
    static class AdminResetHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            electionService.reset();
            sendResponse(exchange, 200, "application/json",
                "{\"success\":true,\"message\":\"Election records reset.\"}");
        }
    }

    // ========================================================================
    // HELPER METHODS
    // ========================================================================
    private static void sendResponse(HttpExchange exchange, int status, String contentType, String content) throws IOException {
        byte[] bytes = content.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String readRequestBody(HttpExchange exchange) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8))) {
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
            return sb.toString();
        }
    }

    private static Map<String, String> parseJson(String json) {
        Map<String, String> map = new HashMap<>();
        if (json == null || json.trim().isEmpty()) return map;
        String clean = json.trim().replaceAll("^[{\\s]+|[}\\s]+$", "");
        String[] pairs = clean.split(",");
        for (String pair : pairs) {
            String[] kv = pair.split(":", 2);
            if (kv.length == 2) {
                String key = kv[0].trim().replace("\"", "");
                String value = kv[1].trim().replace("\"", "");
                map.put(key, value);
            }
        }
        return map;
    }

    private static String escape(String s) {
        return s == null ? "" : s.replace("\"", "\\\"");
    }

    // ========================================================================
    // OOP DOMAIN MODELS & ELECTION SERVICE (Thread-Safe)
    // ========================================================================
    public static class Elector {
        private final String id;
        private final String name;
        private final int age;
        private final String state;
        private final String pin;
        private boolean hasVoted;
        private String votedAt;

        public Elector(String id, String name, int age, String state, String pin) {
            this.id = id;
            this.name = name;
            this.age = age;
            this.state = state;
            this.pin = pin;
            this.hasVoted = false;
        }

        public String getId() { return id; }
        public String getName() { return name; }
        public int getAge() { return age; }
        public String getState() { return state; }
        public String getPin() { return pin; }
        public boolean hasVoted() { return hasVoted; }
        public void setVoted(boolean voted, String timestamp) {
            this.hasVoted = voted;
            this.votedAt = timestamp;
        }
    }

    public static class ElectionService {
        private final Map<String, Elector> electors = new ConcurrentHashMap<>();
        private final Map<String, AtomicInteger> tallies = new ConcurrentHashMap<>();

        public ElectionService() {
            reset();
        }

        public synchronized void reset() {
            electors.clear();
            tallies.clear();
            String[] parties = {"AAP", "BJP", "BSP", "CPI(M)", "INC", "TMC", "NOTA"};
            for (String p : parties) {
                tallies.put(p, new AtomicInteger(0));
            }
        }

        public synchronized Elector registerElector(String name, int age, String state, String pin) {
            String id;
            do {
                int randomSix = 100000 + new Random().nextInt(900000);
                id = "VTR" + randomSix;
            } while (electors.containsKey(id));

            Elector e = new Elector(id, name, age, state, pin);
            electors.put(id, e);
            return e;
        }

        public Elector findElector(String id) {
            if (id == null) return null;
            return electors.get(id.trim().toUpperCase());
        }

        public synchronized boolean castVote(String voterId, String partyCode) {
            Elector e = findElector(voterId);
            if (e == null || e.hasVoted()) return false;
            AtomicInteger count = tallies.get(partyCode);
            if (count == null) return false;

            count.incrementAndGet();
            e.setVoted(true, LocalDateTime.now().toString());
            return true;
        }

        public int getRegisteredCount() {
            return electors.size();
        }

        public int getTotalVotesCount() {
            return tallies.values().stream().mapToInt(AtomicInteger::get).sum();
        }

        public Map<String, Integer> getVoteTally() {
            Map<String, Integer> map = new LinkedHashMap<>();
            String[] parties = {"AAP", "BJP", "BSP", "CPI(M)", "INC", "TMC", "NOTA"};
            for (String p : parties) {
                map.put(p, tallies.get(p).get());
            }
            return map;
        }

        public synchronized void loadSampleVotes() {
            String[] parties = {"AAP", "BJP", "BSP", "CPI(M)", "INC", "TMC", "NOTA"};
            for (String p : parties) {
                tallies.get(p).addAndGet(2);
            }
            for (int i = 0; i < 14; i++) {
                String id = "VTR" + (800000 + i);
                Elector e = new Elector(id, "Sample Elector #" + (i + 1), 25 + i, "National Capital", "1234");
                e.setVoted(true, LocalDateTime.now().toString());
                electors.put(id, e);
            }
        }
    }
}

