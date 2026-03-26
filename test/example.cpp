#include <iostream>
#include <vector>
using namespace std;

int main() {
    cout << "=== FORGE Code Editor Test ===" << endl;
    cout << "Testing C++ compilation and execution" << endl;
    
    vector<int> numbers = {1, 2, 3, 4, 5};
    int sum = 0;
    
    for (int num : numbers) {
        sum += num;
    }
    
    cout << "Sum of numbers: " << sum << endl;
    cout << "Test completed successfully!" << endl;
    
    return 0;
}
