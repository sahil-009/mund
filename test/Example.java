public class Example {
    public static void main(String[] args) {
        System.out.println("=== FORGE Java Test ===");
        System.out.println("Testing Java compilation and execution");
        
        int[] numbers = {1, 2, 3, 4, 5};
        int sum = 0;
        
        for (int num : numbers) {
            sum += num;
        }
        
        System.out.println("Sum of numbers: " + sum);
        System.out.println("Test completed successfully!");
    }
}
