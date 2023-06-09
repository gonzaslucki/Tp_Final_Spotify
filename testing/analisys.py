import pandas as pd

# Load the csv file
df = pd.read_csv('../data.csv')

# Calculate the mean for each user
mean_df = df.groupby('user').mean().reset_index()
# divide loudnes by 10
mean_df['loudness'] = mean_df['loudness'] / 60

# Print the result
print(mean_df)

result = []

# Iterate over each row of the dataframe
for _, row in mean_df.iterrows():
    temp = []
    for column in mean_df.columns:
        if column != 'user':
            # the range of the values should be between 0 and 1
            # so we divide by the maximum value})
            temp.append({'axis': column, 'value': abs(row[column])})
    result.append(temp)

print(result)